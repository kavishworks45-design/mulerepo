import { NextResponse, NextRequest } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MONOREPO_NAME = process.env.GITHUB_MONOREPO_NAME || "mule-poc-library";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (!GITHUB_TOKEN) return NextResponse.json({ content: "" });

    const sha = req.nextUrl.searchParams.get("sha");
    if (!sha) return NextResponse.json({ error: "No sha provided" }, { status: 400 });

    const octokit = new Octokit({
        auth: GITHUB_TOKEN,
        request: { timeout: 60000 }
    });

    try {
        const { data: user } = await octokit.users.getAuthenticated();
        const owner = user.login;

        const { data: blob } = await octokit.git.getBlob({
            owner,
            repo: MONOREPO_NAME,
            file_sha: sha
        });

        const content = Buffer.from(blob.content, 'base64').toString('utf-8');

        return NextResponse.json({ content });
    } catch (e: any) {
        console.error("Blob fetch error:", e);
        return NextResponse.json({ content: "" });
    }
}
