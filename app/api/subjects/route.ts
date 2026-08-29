import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
      },
    });
    return NextResponse.json({ success: true, subjects });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}