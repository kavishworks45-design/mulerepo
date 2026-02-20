import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONOREPO_NAME = process.env.GITHUB_MONOREPO_NAME || "mule-poc-library";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (!GITHUB_TOKEN) return NextResponse.json({ commits: [] });

    const path = req.nextUrl.searchParams.get("path");
    if (!path) return NextResponse.json({ error: "No path provided" });

    const octokit = new Octokit({
        auth: GITHUB_TOKEN,
        request: { timeout: 60000 }
    });

    try {
        const { data: user } = await octokit.users.getAuthenticated();
        const owner = user.login;

        // Fetch commits specifically scoped to this folder path
        const { data: commits } = await octokit.repos.listCommits({
            owner,
            repo: MONOREPO_NAME,
            path: path
        });

        const formattedCommits = commits.map(commitData => {
            const date = new Date(commitData.commit.author?.date || "").toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            return {
                sha: commitData.sha,
                version: commitData.sha.substring(0, 7), // Use short SHA as version identifier
                date: date,
                author: commitData.commit.author?.name || "Unknown",
                message: commitData.commit.message,
                changes: commitData.commit.message.split('\n').filter(msg => msg.trim() !== "") // Break multiline messages into bullet changes
            };
        });

        return NextResponse.json({ commits: formattedCommits });
    } catch (e: any) {
        console.error("Commits fetch error", e);
        return NextResponse.json({ commits: [] });
    }
}
