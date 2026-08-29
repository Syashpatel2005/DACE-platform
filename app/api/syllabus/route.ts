import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const syllabus = await prisma.subject.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        order: true,
        topics: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            order: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, syllabus });
  } catch (error) {
    console.error("Failed to fetch syllabus:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch syllabus" },
      { status: 500 }
    );
  }
}