import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONOREPO_NAME = process.env.GITHUB_MONOREPO_NAME || "mule-poc-library";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (!GITHUB_TOKEN) return NextResponse.json({ tree: [] });

    const path = req.nextUrl.searchParams.get("path");
    if (!path) return NextResponse.json({ error: "No path provided" });

    const octokit = new Octokit({
        auth: GITHUB_TOKEN,
        request: { timeout: 60000 }
    });
    try {
        const { data: user } = await octokit.users.getAuthenticated();
        const owner = user.login;

        // Get SHA of branch
        const { data: repo } = await octokit.repos.get({ owner, repo: MONOREPO_NAME });
        const branch = repo.default_branch;

        const { data: ref } = await octokit.git.getRef({ owner, repo: MONOREPO_NAME, ref: `heads/${branch}` });
        const commitSha = ref.object.sha;

        // Get Tree recursive
        const { data: treeData } = await octokit.git.getTree({
            owner,
            repo: MONOREPO_NAME,
            tree_sha: commitSha,
            recursive: "true"
        });

        // Filter items that belong to the requested folder
        const items = treeData.tree.filter((item: any) => item.path.startsWith(path + "/"));

        // Map to simpler structure relative to the folder
        const tree = items.map((item: any) => ({
            path: item.path.replace(path + "/", ""),
            mode: item.mode,
            type: item.type,
            sha: item.sha,
            url: item.url
        }));

        return NextResponse.json({ tree });
    } catch (e: any) {
        console.error("Tree fetch error", e);
        return NextResponse.json({ tree: [] });
    }
}
