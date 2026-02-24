import { NextResponse } from "next/server";
import { updatePOCStars } from "@/lib/github";

export async function POST(req: Request) {
    try {
        const { folderName, action } = await req.json();

        if (!folderName) {
            return NextResponse.json(
                { error: "folderName is required" },
                { status: 400 },
            );
        }

        const increment = action === "add" ? 1 : -1;
        await updatePOCStars(folderName, increment);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Star API Error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 },
        );
    }
}
