import { NextResponse } from "next/server";
import { downloadPOCFolder } from "@/lib/github";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folderName = searchParams.get('folderName');

        if (!folderName) {
            return NextResponse.json(
                { error: "folderName parameter is required" },
                { status: 400 },
            );
        }

        const zipBuffer = await downloadPOCFolder(folderName);

        // Return the response as a file download
        return new NextResponse(zipBuffer as unknown as BodyInit, {
            status: 200,
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${folderName}.zip"`,
            },
        });
    } catch (error: any) {
        console.error("Download API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to download POC" },
            { status: 500 },
        );
    }
}
