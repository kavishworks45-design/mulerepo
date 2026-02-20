import { NextRequest, NextResponse } from "next/server";
import { createRepoAndPush } from "@/lib/github";
import { analyzeProject } from "@/lib/gemini";
import JSZip from "jszip";

export async function POST(req: NextRequest) {
  console.log("Received POC creation request");

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const pomFile = formData.get("pomFile") as File | null;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json(
        { error: "POC Title is required" },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer(); // Get raw file buffer
    const zip = await JSZip.loadAsync(buffer); // Load zip

    const filesToPush: { path: string; content: Buffer }[] = [];

    const filesMap: Record<string, string> = {};

    // Iterate through zip contents
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue; // Skip directories
      if (
        relativePath.includes("__MACOSX") ||
        relativePath.includes(".DS_Store") ||
        relativePath.includes("target/") || // standard maven build dir
        relativePath.includes("/target/") ||
        relativePath.startsWith("target/") ||
        relativePath.includes(".git/") ||
        relativePath.endsWith(".class") ||
        relativePath.endsWith(".jar") ||
        relativePath.endsWith(".exe") ||
        relativePath.endsWith(".dll")
      )
        continue; // Skip junk & binaries

      // Read file content as Node Buffer
      const content = await zipEntry.async("nodebuffer");

      // Store content for AI analysis if it's code
      if (
        relativePath.endsWith(".xml") ||
        relativePath.endsWith(".dwl") ||
        relativePath.endsWith("pom.xml")
      ) {
        filesMap[relativePath] = content.toString("utf-8");
      }

      filesToPush.push({
        path: relativePath,
        content: content,
      });
    }

    console.log(`Extracted ${filesToPush.length} files from zip.`);

    // Handle Optional POM Override
    if (pomFile) {
      console.log("POM override detected. Replacing project pom.xml.");
      const pomBuffer = Buffer.from(await pomFile.arrayBuffer());

      // Remove existing pom.xml if it exists
      const existingPomIndex = filesToPush.findIndex((f) =>
        f.path.endsWith("pom.xml"),
      );
      if (existingPomIndex !== -1) {
        // Keep the exact same path prefix for the override so it drops in perfectly
        const pomPath = filesToPush[existingPomIndex].path;
        filesToPush[existingPomIndex] = {
          path: pomPath,
          content: pomBuffer,
        };
      } else {
        // If there was literally no pom.xml in the zip, just put it at root
        // Realistically Mule projects have a root folder inside the zip, but we'll try root.
        filesToPush.push({
          path: "pom.xml",
          content: pomBuffer,
        });
      }
    }

    // Generate a folder name from title
    const folderName = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens;

    // 1. Analyze with Gemini
    let aiAnalysis: any = {};
    try {
      console.log("🤖 Running Gemini Analysis...");
      aiAnalysis = (await analyzeProject(filesMap)) || {};
    } catch (e) {
      console.error("AI Analysis failed, proceeding with basic metadata:", e);
    }

    // 2. Prepare Metadata (poc.json inside the folder)
    const pocMetadata = {
      id: Date.now(),
      title: title,
      description:
        (formData.get("description") as string) || "No description provided",
      tags: ["MuleSoft", "Manual Upload"],
      difficulty: "Medium",
      authorId: formData.get("authorId") || "",
      authorName: formData.get("authorName") || "Anonymous",
      createdAt: Date.now(),
      updated: new Date().toISOString(),
      icon: "Code",
    };

    // Add poc.json to files list
    filesToPush.push({
      path: "poc.json",
      content: Buffer.from(JSON.stringify(pocMetadata, null, 2)),
    });

    console.log(`Pushing to GitHub folder: ${folderName}`);

    // 3. Push to GitHub (Standard push)
    const repoData = await createRepoAndPush(
      folderName,
      filesToPush,
      `Add POC: ${title}`,
    );

    return NextResponse.json({
      success: true,
      repoUrl: repoData.url,
      repoName: repoData.name,
      folderName: folderName,
      id: pocMetadata.id,
      aiAnalysis,
    });
  } catch (error: any) {
    console.error("Error creating POC:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
