import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");

    const topics = await prisma.topic.findMany({
      where: subjectId ? { subjectId } : undefined,
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
        subjectId: true,
      },
    });
    return NextResponse.json({ success: true, topics });
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}