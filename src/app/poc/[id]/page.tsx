"use client";

import { use, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { POCS } from "@/data/pocs";
import { getPOCById, POC } from "@/lib/pocs";
import {
  ArrowLeft,
  Download,
  GitBranch,
  Share2,
  Star,
  User,
  Copy,
  Check,
  Terminal,
  Cloud,
  List,
  Code,
  Box,
  Server,
  Database,
  Layers,
  Shield,
  Activity,
  Users,
  Mail,
  Folder,
  Smartphone,
  GitMerge,
  Lock,
  Zap,
  FileCode,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ICON_MAP: Record<string, any> = {
  Box,
  Code,
  Cloud,
  Server,
  Database,
  Layers,
  Shield,
  Activity,
  Users,
  Mail,
  Folder,
  Smartphone,
  GitMerge,
  Lock,
  Zap,
  FileCode,
};

export default function POCDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [poc, setPoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const [fileStructure, setFileStructure] = useState<any[]>([]);

  const [selectedDwlSha, setSelectedDwlSha] = useState<string | null>(null);
  const [dwlContents, setDwlContents] = useState<Record<string, string>>({});
  const [loadingDwl, setLoadingDwl] = useState(false);

  const [extractedDeps, setExtractedDeps] = useState<any[]>([]);
  const [loadingDeps, setLoadingDeps] = useState(false);

  const [commitHistory, setCommitHistory] = useState<any[]>([]);
  const [loadingCommits, setLoadingCommits] = useState(false);

  // Dynamic Flow Parsing State
  const [muleFlows, setMuleFlows] = useState<any[]>([]);
  const [loadingFlows, setLoadingFlows] = useState(false);

  // Deployment Demo State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => { setDeployStep(2); }, 1500);
    setTimeout(() => { setDeployStep(3); }, 3500);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployStep(4);
      setTimeout(() => setDeployStep(0), 4000); // Reset to base state after showing success
    }, 6000);
  };

  // Typing animation logic
  const [visibleCount, setVisibleCount] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileStructure.length > 0 && visibleCount < fileStructure.length) {
      const timeout = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
        // Optional: Auto-scroll to bottom as it types
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
      }, 20); // 20ms typing speed
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, fileStructure]);

  useEffect(() => {
    const fetchPoc = async () => {
      if (!id) return;

      // 1. Check Static Data first
      const staticPoc = POCS.find((p) => p.id === Number(id));
      if (staticPoc) {
        setPoc(staticPoc);
        setLoading(false);
        return;
      }

      // 2. Fetch from GitHub List API
      try {
        let res = await fetch("/api/pocs/list");
        let allPocs = await res.json();
        let found = allPocs.find((p: any) => p.id == id); // Loose equality for string/number match

        if (!found) {
          console.log("POC not found in cache, trying fresh fetch...");
          res = await fetch("/api/pocs/list?fresh=true");
          allPocs = await res.json();
          found = allPocs.find((p: any) => p.id == id);
        }

        if (found) {
          // Map generic metadata to component structure
          const mappedPoc = {
            ...found,
            icon: ICON_MAP[found.icon as string] || Box,
            // Provide defaults for missing AI fields
            details: {
              description: found.description,
              architecture: {
                source: {
                  name: found.architecture?.source?.name || found.details?.architecture?.source?.name || "Source",
                  type: found.architecture?.source?.type || found.details?.architecture?.source?.type || "Unknown",
                  icon: ICON_MAP[found.architecture?.source?.icon || found.details?.architecture?.source?.icon] || Cloud,
                  color: found.architecture?.source?.color || found.details?.architecture?.source?.color || "gray",
                },
                process: {
                  name: found.architecture?.process?.name || found.details?.architecture?.process?.name || "Process",
                  type: found.architecture?.process?.type || found.details?.architecture?.process?.type || "Mule",
                  icon: ICON_MAP[found.architecture?.process?.icon || found.details?.architecture?.process?.icon] || Box,
                  color: found.architecture?.process?.color || found.details?.architecture?.process?.color || "blue",
                },
                target: {
                  name: found.architecture?.target?.name || found.details?.architecture?.target?.name || "Target",
                  type: found.architecture?.target?.type || found.details?.architecture?.target?.type || "Unknown",
                  icon: ICON_MAP[found.architecture?.target?.icon || found.details?.architecture?.target?.icon] || Database,
                  color: found.architecture?.target?.color || found.details?.architecture?.target?.color || "gray",
                }
              },
              logicBreakdown: found.logicBreakdown || found.details?.logicBreakdown || { cards: [] },
              dependencies: found.dependencies || found.details?.dependencies || [],
              changelog: [],
            },
          };
          setPoc(mappedPoc);

          // 3. Fetch File Tree using folderName
          if (found.folderName) {
            try {
              const treeRes = await fetch(
                `/api/pocs/tree?path=${found.folderName}`,
              );
              const treeData = await treeRes.json();
              if (treeData.tree) setFileStructure(treeData.tree);
            } catch (err) {
              console.error("Failed to fetch tree:", err);
            }
          }
        } else {
          console.error("POC not found in GitHub list");
        }
      } catch (e) {
        console.error("Error fetching POC list", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPoc();
  }, [id]);

  const dwlFiles = fileStructure.filter((f: any) => f.path.endsWith(".dwl"));

  // Automatically select the first DWL file if available
  useEffect(() => {
    if (activeTab === "dataweave" && dwlFiles.length > 0 && !selectedDwlSha) {
      setSelectedDwlSha(dwlFiles[0].sha);
    }
  }, [activeTab, dwlFiles, selectedDwlSha]);

  // Fetch DWL content dynamically
  useEffect(() => {
    const fetchDwlContent = async () => {
      if (!selectedDwlSha || dwlContents[selectedDwlSha]) return;

      setLoadingDwl(true);
      try {
        const res = await fetch(`/api/pocs/file?sha=${selectedDwlSha}`);
        const data = await res.json();
        if (data.content) {
          setDwlContents((prev) => ({
            ...prev,
            [selectedDwlSha]: data.content,
          }));
        }
      } catch (err) {
        console.error("Error fetching DWL file:", err);
      } finally {
        setLoadingDwl(false);
      }
    };

    fetchDwlContent();
  }, [selectedDwlSha, dwlContents]);

  // Fetch and Parse POM.xml for dependencies dynamically
  useEffect(() => {
    const fetchPomDependencies = async () => {
      if (activeTab !== "dependencies" || extractedDeps.length > 0) return;

      const pomFile = fileStructure.find(
        (f: any) => f.path.endsWith("pom.xml") && !f.path.includes("/target/"),
      );
      if (!pomFile) return;

      setLoadingDeps(true);
      try {
        const res = await fetch(`/api/pocs/file?sha=${pomFile.sha}`);
        const data = await res.json();
        if (data.content) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data.content, "text/xml");

          // Extract properties for variable resolution
          const properties: Record<string, string> = {};
          const propertiesNode = xmlDoc.getElementsByTagName("properties")[0];
          if (propertiesNode) {
            for (let i = 0; i < propertiesNode.children.length; i++) {
              const child = propertiesNode.children[i];
              properties[child.tagName] = child.textContent || "";
            }
          }

          // Helper to resolve Maven properties like ${mule.version}
          const resolveProperty = (value: string) => {
            if (!value) return value;
            const match = value.match(/\$\{(.*?)\}/);
            if (match && match[1]) {
              return properties[match[1]] || value;
            }
            return value;
          };

          const dependenciesTags = xmlDoc.getElementsByTagName("dependencies");
          // Usually the first dependencies block is the main one unless under dependencyManagement
          let mainDependencies: Element | null = null;
          for (let i = 0; i < dependenciesTags.length; i++) {
            if (
              dependenciesTags[i].parentElement?.tagName.toLowerCase() ===
              "project"
            ) {
              mainDependencies = dependenciesTags[i];
              break;
            }
          }

          if (mainDependencies) {
            const depNodes =
              mainDependencies.getElementsByTagName("dependency");
            const deps = Array.from(depNodes).map((node) => {
              const group = resolveProperty(
                node.getElementsByTagName("groupId")[0]?.textContent || "",
              );
              const name = resolveProperty(
                node.getElementsByTagName("artifactId")[0]?.textContent || "",
              );
              const rawVersion =
                node.getElementsByTagName("version")[0]?.textContent || "";
              const version = resolveProperty(rawVersion);
              const classifier =
                node.getElementsByTagName("classifier")[0]?.textContent;
              return {
                name,
                group,
                version: version || "managed",
                scope: classifier || "compile",
              };
            });
            setExtractedDeps(deps);
          }
        }
      } catch (err) {
        console.error("Error fetching or parsing pom.xml:", err);
      } finally {
        setLoadingDeps(false);
      }
    };

    fetchPomDependencies();
  }, [activeTab, fileStructure, extractedDeps.length]);

  // Fetch GitHub commit history dynamically for Changelog
  useEffect(() => {
    const fetchCommits = async () => {
      if (activeTab !== "changelog" || commitHistory.length > 0 || !poc) return;

      setLoadingCommits(true);
      try {
        const pathStr =
          poc.folderName ||
          (poc.repoUrl
            ? poc.repoUrl.split("/").pop()
            : poc.title.replace(/\s+/g, "-").toLowerCase());
        const res = await fetch(`/api/pocs/commits?path=${pathStr}`);
        const data = await res.json();

        if (data.commits && data.commits.length > 0) {
          setCommitHistory(data.commits);
        }
      } catch (err) {
        console.error("Error fetching commits:", err);
      } finally {
        setLoadingCommits(false);
      }
    };

    fetchCommits();
  }, [activeTab, poc, commitHistory.length]);

  // Fetch and Parse Mule Flows dynamically
  useEffect(() => {
    const fetchAndParseFlows = async () => {
      if (activeTab !== "flow-design" || muleFlows.length > 0) return;

      // Find all XML files globally (except build artifacts)
      const muleXmlFiles = fileStructure.filter(
        (f: any) =>
          f.path.endsWith(".xml") &&
          !f.path.endsWith("pom.xml") &&
          !f.path.includes("/target/"),
      );
      if (muleXmlFiles.length === 0) return;

      setLoadingFlows(true);
      try {
        const parsedFlows = [];

        for (const file of muleXmlFiles) {
          const res = await fetch(`/api/pocs/file?sha=${file.sha}`);
          const data = await res.json();

          if (data.content) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.content, "text/xml");

            // Find all flow-like elements (regardless of namespace like <mule:flow>)
            const allNodes = Array.from(xmlDoc.getElementsByTagName("*"));
            const flowNodes = allNodes.filter(
              (node) =>
                node.tagName.toLowerCase() === "flow" ||
                node.tagName.toLowerCase().endsWith(":flow") ||
                node.tagName.toLowerCase() === "sub-flow" ||
                node.tagName.toLowerCase().endsWith(":sub-flow"),
            );

            for (const flowNode of flowNodes) {
              const flowName = flowNode.getAttribute("name") || "Unnamed Flow";
              const type = flowNode.tagName.toLowerCase().includes("sub-flow")
                ? "sub-flow"
                : "flow";

              const components = [];
              for (let i = 0; i < flowNode.children.length; i++) {
                const child = flowNode.children[i];
                const tagName = child.tagName;
                const docName = child.getAttribute("doc:name");

                // Clean up the tag name (e.g. ee:transform -> Transform Message)
                let niceName = tagName;
                let icon = Box;
                let color = "zinc";

                if (tagName.includes("listener")) {
                  niceName = "HTTP Listener";
                  icon = Globe;
                  color = "blue";
                } else if (tagName.includes("transform")) {
                  niceName = "Transform Message";
                  icon = Code;
                  color = "purple";
                } else if (tagName.includes("logger")) {
                  niceName = "Logger";
                  icon = Terminal;
                  color = "zinc";
                } else if (tagName.includes("request")) {
                  niceName = "HTTP Request";
                  icon = Globe;
                  color = "blue";
                } else if (tagName.includes("query")) {
                  niceName = "Database/Salesforce Query";
                  icon = Database;
                  color = "green";
                } else {
                  // Make unknown tags pretty
                  const parts = tagName.split(":");
                  if (parts.length > 1) {
                    niceName =
                      parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
                  }
                }

                components.push({
                  id: `${flowName}-cmp-${i}`,
                  tag: tagName,
                  name: docName || niceName,
                  icon,
                  color,
                });
              }

              parsedFlows.push({
                name: flowName,
                type: type,
                file: file.path.split("/").pop(),
                components,
              });
            }
          }
        }

        setMuleFlows(parsedFlows);
      } catch (err) {
        console.error("Error fetching/parsing flows:", err);
      } finally {
        setLoadingFlows(false);
      }
    };

    fetchAndParseFlows();
  }, [activeTab, fileStructure, muleFlows.length]);

  const handleCopy = () => {
    setCopied(true);
    const code = selectedDwlSha
      ? dwlContents[selectedDwlSha]
      : poc?.details?.dataWeave?.code;
    navigator.clipboard.writeText(code || "");
    setTimeout(() => setCopied(false), 2000);
  };

  const MULE_FACTS = [
    "Did you know? MuleSoft was named to reflect the 'donkey work' of data integration it automates.",
    "Fact: DataWeave is the powerful functional language for data transformation in Mule.",
    "Trivia: Salesforce acquired MuleSoft in 2018 for a record $6.5 billion.",
    "Tip: API-led connectivity divides APIs into System, Process, and Experience layers.",
    "Note: The Mule runtime is lightweight, scalable, and based on Java.",
    "History: RAML (RESTful API Modeling Language) was co-created by MuleSoft.",
    "Stat: Anypoint Platform processes billions of transactions daily.",
  ];

  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % MULE_FACTS.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground z-50">
        {/* Minimalist Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
          <Box className="w-16 h-16 text-blue-500 animate-[pulse_3s_ease-in-out_infinite]" />
        </div>

        <h2 className="text-xl font-medium tracking-wide text-zinc-200 mb-2">
          Initializing Environment
        </h2>

        {/* Elegant Facts Display */}
        <div className="h-20 flex items-center justify-center max-w-2xl mx-auto px-6">
          <p className="text-zinc-300 text-lg md:text-xl font-light text-center animate-in fade-in zoom-in duration-700 key={factIndex} leading-relaxed">
            {MULE_FACTS[factIndex]}
          </p>
        </div>

        {/* Ultra-thin Progress Line */}
        <div className="mt-8 w-48 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite_alternate] w-full origin-left"></div>
        </div>
      </div>
    );
  }

  if (!poc) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-zinc-400 mb-6">POC not found</p>
          <Link
            href="/browse"
            className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  // Safe access to details (in case older data exists, though we updated all)
  const details = poc.details || {}; // Fallback for minimal local POCs

  const timeAgo = (dateStr: string) => {
    if (!dateStr || dateStr === "Unknown") return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        {/* Breadcrumbs & Back */}
        <div className="container px-4 mx-auto mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repository
          </Link>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`px-2 py-1 rounded text-xs font-medium border ${poc.difficulty === "Advanced"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : poc.difficulty === "Intermediate"
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                >
                  {poc.difficulty}
                </div>
                <span className="text-xs text-muted-foreground">
                  v{poc.version || "1.0.0"}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  Updated {timeAgo(poc.updated)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <poc.icon className="h-8 w-8" />
                </span>
                {poc.title}
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                {poc.description || poc.fullDescription}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(poc.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-zinc-900/50 border border-white/10 text-sm text-zinc-400 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-zinc-300">
                    By {poc.authorName || poc.author || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500/50" />
                  <span>{poc.stars || 0} Stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span>{poc.forks || 0} Forks</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
              <button
                onClick={handleDeploy}
                disabled={isDeploying || deployStep === 4}
                className={`flex-1 btn btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 group ${isDeploying
                  ? "bg-blue-900/50 text-blue-200 border border-blue-500/50 cursor-wait shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  : deployStep === 4
                    ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-default"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:-translate-y-0.5"
                  }`}
              >
                {isDeploying ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {deployStep === 1 && "Authenticating..."}
                    {deployStep === 2 && "Provisioning Worker..."}
                    {deployStep === 3 && "Starting App..."}
                  </>
                ) : deployStep === 4 ? (
                  <>
                    <Check className="h-5 w-5" />
                    Live on CloudHub
                  </>
                ) : (
                  <>
                    <Cloud className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
                    Deploy to CloudHub
                  </>
                )}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-zinc-700">
                <Download className="h-4 w-4" />
                Download Zip
              </button>
              <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-4 py-3 rounded-lg border border-zinc-800 transition-colors">
                <GitBranch className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border mb-8 sticky top-16 bg-background/80 backdrop-blur-md z-40">
          <div className="container px-4 mx-auto overflow-x-auto">
            <div className="flex space-x-8">
              {[
                "Overview",
                "Flow Design",
                "DataWeave",
                "Dependencies",
                "Changelog",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab.toLowerCase().replace(" ", "-"))
                  }
                  className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase().replace(" ", "-")
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container px-4 mx-auto min-h-[500px]">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Architecture & Flow Logic
                    </h3>
                  </div>

                  {/* ARCHITECTURE DIAGRAM */}
                  {(() => {
                    const displayArch =
                      details?.architecture ||
                      (muleFlows.length > 0
                        ? {
                          source: {
                            name:
                              muleFlows[0].components[0]?.name ||
                              "Dynamic Trigger",
                            type: "Source Listener",
                            icon: muleFlows[0].components[0]?.icon || Globe,
                            color:
                              muleFlows[0].components[0]?.color || "blue",
                          },
                          process: {
                            name: "MuleSoft 4",
                            type: "Transform & Route",
                            icon: Activity,
                            color: "purple",
                          },
                          target: {
                            name:
                              muleFlows[0].components.length > 1
                                ? muleFlows[0].components[
                                  muleFlows[0].components.length - 1
                                ].name
                                : "Internal Logic",
                            type: "Target System",
                            icon:
                              muleFlows[0].components.length > 1
                                ? muleFlows[0].components[
                                  muleFlows[0].components.length - 1
                                ].icon
                                : Database,
                            color:
                              muleFlows[0].components.length > 1
                                ? muleFlows[0].components[
                                  muleFlows[0].components.length - 1
                                ].color
                                : "green",
                          },
                        }
                        : null);

                    if (!displayArch) {
                      return (
                        <div className="bg-[#09090b] rounded-xl border border-white/10 p-8 text-center text-zinc-500 shadow-2xl">
                          <Box className="h-8 w-8 mx-auto mb-3 opacity-50" />
                          Waiting for flow design to parse architecture...
                        </div>
                      );
                    }

                    return (
                      <div className="bg-[#09090b] rounded-xl border border-white/10 relative overflow-hidden group shadow-2xl p-8">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                        <div className="relative z-10 flex items-center justify-between gap-8 max-w-2xl mx-auto">
                          {/* Connecting Line */}
                          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-zinc-800 -z-10"></div>
                          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-blue-500/20 -z-10 animate-pulse"></div>

                          {/* Source */}
                          <div className="flex flex-col items-center gap-4 bg-[#09090b] p-2">
                            <div
                              className={`w-16 h-16 rounded-xl bg-zinc-900 border ${displayArch.source.color === "blue" ? "border-blue-500/50" : displayArch.source.color === "green" ? "border-green-500/50" : "border-zinc-700"} flex items-center justify-center shadow-lg relative group`}
                            >
                              <displayArch.source.icon
                                className={`h-8 w-8 ${displayArch.source.color === "blue" ? "text-blue-400" : displayArch.source.color === "green" ? "text-green-400" : "text-zinc-400"}`}
                              />
                              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                                1
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                className="text-sm font-bold text-white max-w-[100px] truncate"
                                title={displayArch.source.name}
                              >
                                {displayArch.source.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {displayArch.source.type}
                              </div>
                            </div>
                          </div>

                          {/* Process (Mule) */}
                          <div className="flex flex-col items-center gap-4 bg-[#09090b] p-2">
                            <div className="w-20 h-20 rounded-full bg-zinc-900 border border-purple-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] relative z-10">
                              <displayArch.process.icon className="h-10 w-10 text-purple-400" />
                              {/* Transformation Icon */}
                              <div className="absolute -bottom-3 bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Code className="h-3 w-3 text-purple-400" />
                                <span className="text-[10px] text-zinc-300 font-mono">
                                  dw 2.0
                                </span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-bold text-white">
                                {displayArch.process.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {displayArch.process.type}
                              </div>
                            </div>
                          </div>

                          {/* Target */}
                          <div className="flex flex-col items-center gap-4 bg-[#09090b] p-2">
                            <div
                              className={`w-16 h-16 rounded-xl bg-zinc-900 border ${displayArch.target.color === "green" ? "border-green-500/50" : displayArch.target.color === "blue" ? "border-blue-500/50" : "border-zinc-700"} flex items-center justify-center shadow-lg relative`}
                            >
                              <displayArch.target.icon
                                className={`h-8 w-8 ${displayArch.target.color === "green" ? "text-green-400" : displayArch.target.color === "blue" ? "text-blue-400" : "text-zinc-400"}`}
                              />
                              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                                2
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                className="text-sm font-bold text-white max-w-[100px] truncate"
                                title={displayArch.target.name}
                              >
                                {displayArch.target.name}
                              </div>
                              <div className="text-xs text-zinc-500">
                                {displayArch.target.type}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* File Structure Preview */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <List className="h-4 w-4 text-zinc-500" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                        Source Structure
                      </h4>
                    </div>
                    <div
                      ref={scrollContainerRef}
                      className="bg-[#0c0c0c] rounded-lg p-4 font-mono text-xs text-zinc-400 border border-white/5 h-[400px] overflow-y-auto overflow-x-auto scrollbar-thin cursor-text shadow-inner"
                    >
                      <div className="flex items-center gap-2 text-blue-400 mb-2 sticky top-0 bg-[#0c0c0c]/90 backdrop-blur-sm pb-2 z-10 border-b border-white/5">
                        <Terminal className="h-3 w-3" />
                        <span className="opacity-50">root@mulesoft-box:</span>
                        <span>
                          ~/
                          {poc.repoUrl
                            ? poc.repoUrl.split("/").pop()
                            : poc.title.replace(/\s+/g, "-").toLowerCase()}
                        </span>
                      </div>

                      {fileStructure.length > 0 ? (
                        <div className="pl-2 border-l border-zinc-800/50 ml-1.5 space-y-0.5">
                          {fileStructure
                            .filter((file: any) => {
                              const root = poc.repoUrl
                                ? poc.repoUrl.split("/").pop()
                                : poc.title.replace(/\s+/g, "-").toLowerCase();
                              return file.path !== root;
                            })
                            .slice(0, visibleCount) // Animate items appearing
                            .map((file: any, i: number) => {
                              const fullPath = file.path;
                              const rootFolder = poc.repoUrl
                                ? poc.repoUrl.split("/").pop()
                                : poc.title.replace(/\s+/g, "-").toLowerCase();
                              const relativePath = fullPath.startsWith(
                                rootFolder + "/",
                              )
                                ? fullPath.substring(rootFolder.length + 1)
                                : fullPath;
                              const parts = relativePath.split("/");
                              const fileName = parts.pop();
                              const depth = parts.length;

                              return (
                                <div
                                  key={i}
                                  className="flex items-center gap-2"
                                  style={{
                                    paddingLeft: `${Math.min(depth * 12, 40)}px`,
                                  }}
                                >
                                  <span className="text-zinc-600">├──</span>
                                  <span
                                    className={`${fileName.endsWith(".xml") ? "text-white" : fileName.endsWith(".dwl") ? "text-yellow-400" : "text-zinc-400"}`}
                                  >
                                    {fileName}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="pl-4 border-l border-zinc-800 ml-1.5 mt-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-600">├──</span>{" "}
                            src/main/mule/
                            <span className="text-white">interface.xml</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-600">├──</span>{" "}
                            src/main/mule/
                            <span className="text-white">
                              implementation.xml
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-600">├──</span>{" "}
                            src/main/resources/
                            <span className="text-yellow-400">
                              transform.dwl
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-600">└──</span> pom.xml
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Logic Breakdown
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                    {(() => {
                      const rawCards = details?.logicBreakdown?.cards || [];
                      const displayLogicCards = rawCards.length > 0
                        ? rawCards.map((card: any) => ({
                          ...card,
                          icon: ICON_MAP[card.icon as string] || Box,
                        }))
                        : muleFlows
                          .map((f) => ({
                            title: f.name,
                            icon: f.type === "sub-flow" ? Layers : GitMerge,
                            text: `Executes a sequence of ${f.components.length} integration steps. Ends with ${f.components.length > 0 ? f.components[f.components.length - 1].name : "completion"}.`,
                            color: f.type === "sub-flow" ? "purple" : "blue",
                          }))
                          .slice(0, 4);

                      if (displayLogicCards.length === 0) {
                        if (loadingFlows) {
                          return (
                            <div className="col-span-full text-center text-zinc-500 py-8 border border-white/5 rounded-lg bg-zinc-900/20 animate-pulse">
                              Scanning application logic...
                            </div>
                          );
                        }
                        return (
                          <div className="col-span-full text-center text-zinc-500 py-8 border border-white/5 rounded-lg bg-zinc-900/20">
                            No logic breakdown available currently.
                          </div>
                        );
                      }

                      return displayLogicCards.map((card: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg bg-zinc-900/40 border border-white/5"
                        >
                          <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                            <card.icon
                              className={`h-4 w-4 ${card.color === "blue" ? "text-blue-400" : card.color === "green" ? "text-green-400" : "text-purple-400"}`}
                            />
                            <span className="truncate">{card.title}</span>
                          </h4>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {card.description || card.text}
                          </p>
                        </div>
                      ));
                    })()}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-1">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Key Details
                    </h3>
                  </div>
                  <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        API Name
                      </h4>
                      <p className="text-sm text-zinc-400">{poc.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Version
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {poc.version || "1.0.0"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Deployment Target
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {poc.tags.find(
                          (t: string) =>
                            t.includes("CloudHub") || t.includes("Fabric"),
                        ) || "CloudHub 2.0"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Last Updated
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {timeAgo(poc.updated)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">
                        Author
                      </h4>
                      <p className="text-sm text-zinc-400">
                        {poc.authorName || poc.author || "Unknown"}
                      </p>
                    </div>
                  </div>
                </section>

                {/* BEST PRACTICES & HEALTH SCORE SECTION */}
                <section className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-400" />
                      Security & Health
                    </h3>
                  </div>

                  <div className="bg-[#121214] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-white/5 flex items-center gap-4">
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${!poc.healthScore ? 'text-zinc-500 bg-zinc-900' :
                        poc.healthScore >= 90 ? 'text-green-400 bg-green-500/10 border-2 border-green-500/50' :
                          poc.healthScore >= 70 ? 'text-yellow-400 bg-yellow-500/10 border-2 border-yellow-500/50' :
                            'text-red-400 bg-red-500/10 border-2 border-red-500/50'
                        }`}>
                        {poc.healthScore || 'N/A'}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Overall Quality</h4>
                        <p className="text-sm text-zinc-400">Determined by Gemini AI Analysis</p>
                      </div>
                    </div>

                    {poc.bestPractices && poc.bestPractices.length > 0 ? (
                      <div className="p-4 bg-black/20 space-y-3">
                        {poc.bestPractices.map((check: any, idx: number) => (
                          <div key={idx} className="flex gap-3 text-sm">
                            <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${check.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-500'}`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <div>
                              <div className={`font-medium ${check.passed ? 'text-zinc-300' : 'text-red-400'}`}>{check.title}</div>
                              <div className="text-zinc-500 text-xs mt-0.5">{check.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-zinc-500 bg-black/20">
                        Wait for next AI scan to view detailed checklist.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === "flow-design" && (
            <div className="animate-in fade-in duration-300 relative min-h-[400px]">
              {loadingFlows ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-xl border border-white/5">
                  <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <span className="text-zinc-400 text-sm animate-pulse">
                    Parsing XML Flows...
                  </span>
                </div>
              ) : muleFlows.length > 0 ? (
                <div className="space-y-8">
                  {muleFlows.map((flow, i) => (
                    <div
                      key={i}
                      className="bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-1.5 rounded-md ${flow.type === "sub-flow" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}
                          >
                            <Activity className="h-4 w-4" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {flow.name}
                          </h3>
                          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full ml-2 border border-white/5 font-mono">
                            {flow.file}
                          </span>
                        </div>
                      </div>

                      <div className="p-8 overflow-x-auto scrollbar-thin">
                        <div className="flex items-center gap-2 min-w-max">
                          {flow.components.length === 0 ? (
                            <div className="text-zinc-500 italic text-sm py-4">
                              Empty flow definition
                            </div>
                          ) : (
                            flow.components.map((cmp: any, idx: number) => (
                              <div key={idx} className="flex items-center">
                                {/* Component Node */}
                                <div
                                  className={`w-36 flex flex-col items-center bg-[#1e1e24] border ${cmp.color === "blue" ? "border-blue-500/30" : cmp.color === "purple" ? "border-purple-500/30" : cmp.color === "green" ? "border-green-500/30" : "border-zinc-700"} rounded-lg p-3 relative group transition-all hover:-translate-y-1 hover:shadow-lg`}
                                >
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] font-mono text-zinc-500 bg-black/40 px-1 py-0.5 rounded max-w-full truncate">
                                      {cmp.tag}
                                    </span>
                                  </div>
                                  <cmp.icon
                                    className={`h-8 w-8 mb-3 ${cmp.color === "blue" ? "text-blue-400" : cmp.color === "purple" ? "text-purple-400" : cmp.color === "green" ? "text-green-400" : "text-zinc-400"}`}
                                  />
                                  <span className="text-[10px] sm:text-xs font-medium text-center text-zinc-200 line-clamp-3 leading-tight w-full break-words">
                                    {cmp.name}
                                  </span>
                                </div>

                                {/* Connector Line */}
                                {idx < flow.components.length - 1 && (
                                  <div className="w-12 h-[2px] bg-zinc-700 relative flex items-center justify-center">
                                    <div className="absolute right-0 w-2 h-2 border-t-2 border-r-2 border-zinc-500 transform rotate-45 mr-0.5 bg-zinc-700 rounded-sm"></div>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-card/50 border border-border rounded-xl text-center">
                  <div className="h-16 w-16 text-zinc-700 mb-6 border border-zinc-700 rounded-lg flex items-center justify-center">
                    <Code className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Flows Found</h3>
                  <p className="text-muted-foreground max-w-md mb-8">
                    We couldn't detect any standard .xml flow definitions in
                    this repository.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "dataweave" && (
            <div className="animate-in fade-in duration-300">
              {dwlFiles.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* DWL File List Sidebar */}
                  <div className="lg:col-span-1 bg-[#1e1e2e]/50 border border-white/5 rounded-xl overflow-hidden flex flex-col h-[500px]">
                    <div className="px-4 py-3 border-b border-white/5 bg-black/20 flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-blue-400" />
                      <h4 className="font-semibold text-sm text-white">
                        DataWeave Files
                      </h4>
                      <span className="ml-auto bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">
                        {dwlFiles.length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                      {dwlFiles.map((file: any) => {
                        const fileName = file.path.split("/").pop();
                        const isSelected = selectedDwlSha === file.sha;
                        return (
                          <button
                            key={file.sha}
                            onClick={() => setSelectedDwlSha(file.sha)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-3 group ${isSelected ? "bg-blue-600/20 text-blue-100 border border-blue-500/30" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"}`}
                          >
                            <Code
                              className={`h-4 w-4 ${isSelected ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-400"}`}
                            />
                            <div className="truncate flex-1">
                              <span className="block truncate font-medium">
                                {fileName}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Code Viewer Main Area */}
                  <div className="lg:col-span-3 bg-[#1e1e2e] border border-white/5 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-2xl relative">
                    {selectedDwlSha && (
                      <>
                        <div className="px-6 py-3 border-b border-white/5 bg-black/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-zinc-300 font-mono">
                            <Code className="h-4 w-4 text-yellow-400" />
                            {dwlFiles
                              .find((f) => f.sha === selectedDwlSha)
                              ?.path.split("/")
                              .pop()}
                          </div>
                          <button
                            onClick={handleCopy}
                            disabled={
                              loadingDwl || !dwlContents[selectedDwlSha]
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors font-medium border border-white/5 disabled:opacity-50"
                          >
                            {copied ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <div className="p-6 overflow-auto flex-1 text-sm font-mono text-blue-100 leading-relaxed scrollbar-thin relative">
                          {loadingDwl ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="h-6 w-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                              <span className="text-zinc-500 text-xs animate-pulse">
                                Fetching from repository...
                              </span>
                            </div>
                          ) : (
                            <pre className="whitespace-pre-wrap word-break">
                              {dwlContents[selectedDwlSha] ||
                                "// No content found or empty file"}
                            </pre>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : details?.dataWeave?.code ? (
                // Fallback for older POCs with hardcoded DWL in metadata
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      DataWeave Transformation
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-700/50 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors font-medium border border-white/5"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="p-6 overflow-auto text-sm font-mono text-blue-100 leading-relaxed bg-[#1e1e2e] rounded-lg border border-white/5">
                    <pre>{details.dataWeave.code}</pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                  <Code className="h-10 w-10 text-zinc-700 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-400">
                    No DataWeave Files Found
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-sm text-center mt-2">
                    This repository does not contain any functional .dwl
                    transformation files.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "dependencies" && (
            <div className="bg-card/50 border border-border rounded-xl overflow-hidden animate-in fade-in duration-300 relative min-h-[300px]">
              {loadingDeps ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                  <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <span className="text-zinc-400 text-sm animate-pulse">
                    Parsing pom.xml dependencies...
                  </span>
                </div>
              ) : (
                <>
                  {/* Display Extracted Deps, fallback to static details.dependencies */}
                  {(extractedDeps.length > 0
                    ? extractedDeps
                    : details?.dependencies || []
                  ).length > 0 ? (
                    <table className="w-full text-left text-sm">
                      <thead className="bg-zinc-900/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                          <th className="px-6 py-4">Dependency Name</th>
                          <th className="px-6 py-4">Group ID</th>
                          <th className="px-6 py-4">Version</th>
                          <th className="px-6 py-4">Classifier / Scope</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(extractedDeps.length > 0
                          ? extractedDeps
                          : details.dependencies
                        ).map((dep: any, i: number) => (
                          <tr
                            key={i}
                            className="hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-foreground">
                              {dep.name}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {dep.group}
                            </td>
                            <td className="px-6 py-4 text-blue-400 font-mono">
                              {dep.version}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              <span className="px-2 py-1 rounded bg-zinc-800 text-xs border border-white/5">
                                {dep.scope}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-16 text-center text-zinc-500">
                      <Layers className="h-12 w-12 text-zinc-800 mb-4" />
                      <p className="font-medium text-zinc-400">
                        No external dependencies found
                      </p>
                      <p className="text-sm mt-1">
                        We could not locate any dependencies in the root pom.xml
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "changelog" && (
            <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300 py-8 relative min-h-[300px]">
              {loadingCommits ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="h-8 w-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                  <span className="text-zinc-500 text-sm animate-pulse">
                    Fetching repository history...
                  </span>
                </div>
              ) : (
                <>
                  {/* Display Extracted Commits, fallback to static details.changelog */}
                  {(commitHistory.length > 0
                    ? commitHistory
                    : details?.changelog || []
                  ).length > 0 ? (
                    (commitHistory.length > 0
                      ? commitHistory
                      : details.changelog
                    ).map((release: any, i: number) => (
                      <div
                        key={i}
                        className="relative pl-8 border-l border-zinc-800 pb-8 last:pb-0"
                      >
                        <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-background"></div>
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {release.version
                              ? `Commit: ${release.version}`
                              : `v${release.version}`}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-white/5">
                            {release.date}
                          </span>
                        </div>

                        {(poc.authorName || poc.author || release.author) && (
                          <p className="text-xs text-zinc-500 mb-2">
                            Committed by{" "}
                            {poc.authorName || poc.author || release.author}
                          </p>
                        )}

                        <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-sm">
                          {release.changes.map((change: string, j: number) => {
                            const isInitial = change.includes("Add POC:");
                            const displayChange = isInitial
                              ? `Initial Upload by ${poc.authorName || poc.author || release.author}`
                              : change;
                            return (
                              <li
                                key={j}
                                className={
                                  isInitial ? "text-zinc-300 font-medium" : ""
                                }
                              >
                                {displayChange}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 border border-white/5 rounded-xl bg-zinc-900/20 py-16">
                      <GitBranch className="h-10 w-10 text-zinc-700 mb-4" />
                      <h3 className="text-lg font-medium text-zinc-400">
                        No Commit History
                      </h3>
                      <p className="text-sm text-zinc-500 max-w-sm mt-2">
                        We could not retrieve the commit log for this
                        repository.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
