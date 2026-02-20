import { NextRequest, NextResponse } from "next/server";
import { deletePOCFolder } from "@/lib/github";

export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const folderName = url.searchParams.get("folderName");

        if (!folderName) {
            return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
        }

        console.log(`Received request to delete POC folder: ${folderName}`);

        const success = await deletePOCFolder(folderName);

        if (success) {
            return NextResponse.json({ success: true, message: "POC deleted successfully" });
        } else {
            return NextResponse.json({ error: "Failed to delete POC" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Error deleting POC:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
