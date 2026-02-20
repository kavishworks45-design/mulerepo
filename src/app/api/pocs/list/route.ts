import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONOREPO_NAME = process.env.GITHUB_MONOREPO_NAME || "mule-poc-library";

export const dynamic = 'force-dynamic'; // Prevent edge stale responses

// Server-side in-memory cache to prevent pounding the GitHub API
let globalCache: { pocs: any[], timestamp: number } | null = null;
const CACHE_TTL_MS = 300 * 1000; // 5 minute lightning cache

export async function GET(req: NextRequest) {
    if (!GITHUB_TOKEN) {
        console.warn("GITHUB_TOKEN missing in API");
        return NextResponse.json([], { status: 200 });
    }

    const forceFresh = req.nextUrl.searchParams.get("fresh") === "true";

    // 1. Lightning Fast Return: If we have fresh memory cache, instantly resolve it.
    if (!forceFresh && globalCache && (Date.now() - globalCache.timestamp < CACHE_TTL_MS)) {
        console.log("Serving /api/pocs/list from Instant Server Cache");
        return NextResponse.json(globalCache.pocs);
    }

    const octokit = new Octokit({
        auth: GITHUB_TOKEN,
        request: { timeout: 60000 }
    });

    try {
        const { data: user } = await octokit.users.getAuthenticated();
        const owner = user.login;

        // 1. Get Repo & Branch Info
        const { data: repo } = await octokit.repos.get({ owner, repo: MONOREPO_NAME });
        const branch = repo.default_branch;

        // 2. Get Tree (Recursive) to find all poc.json files
        // By directly using the branch name (e.g. 'main') for tree_sha, we save an entire roundtrip API call to getRef!
        const { data: treeData } = await octokit.git.getTree({
            owner,
            repo: MONOREPO_NAME,
            tree_sha: branch,
            recursive: "true"
        });

        // 3. Filter for poc.json
        // path is like "my-poc/poc.json"
        const jsonFiles = treeData.tree.filter((item: any) => item.path.endsWith("poc.json"));

        if (jsonFiles.length === 0) return NextResponse.json([]);

        // 4. Fetch content for each Metadata file
        const pocsPromises = jsonFiles.map(async (file: any) => {
            try {
                // Fetch blob content directly (faster/cheaper than getContent)
                const { data: blob } = await octokit.git.getBlob({
                    owner,
                    repo: MONOREPO_NAME,
                    file_sha: file.sha
                });

                const text = Buffer.from(blob.content, "base64").toString("utf-8");
                const metadata = JSON.parse(text);

                // Extract folder name from path "folder/sub/poc.json" -> "folder/sub"?
                // Usually "folder/poc.json".
                const folderPath = file.path.replace("/poc.json", "");

                return {
                    ...metadata,
                    // Ensure robust fallback if metadata is missing fields
                    tags: metadata.tags || ["MuleSoft"],
                    difficulty: metadata.difficulty || "Medium",
                    folderName: folderPath,
                    repoUrl: `https://github.com/${owner}/${MONOREPO_NAME}/tree/${branch}/${folderPath}`,
                    updated: metadata.updated || "Unknown",
                    createdAt: metadata.createdAt || Date.now()
                };
            } catch (e) {
                console.error(`Failed to parse ${file.path}`, e);
                return null;
            }
        });

        const pocs = await Promise.all(pocsPromises);

        // Filter nulls and sort
        const validPocs = pocs.filter(p => p !== null).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));

        // Populate the Server Cache before responding
        globalCache = {
            pocs: validPocs,
            timestamp: Date.now()
        };

        return NextResponse.json(validPocs);

    } catch (e: any) {
        if (e.status === 404) return NextResponse.json([]);
        console.error("Failed to list POCs:", e.message);
        return NextResponse.json([]);
    }
}
