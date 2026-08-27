import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const ping = await prisma.ping.create({
      data: { message: "Hello from DAce!" },
    });
    return NextResponse.json({ success: true, ping });
  } catch (error) {
    console.error("Ping creation failed:", error);
    return NextResponse.json({ success: false, error: "Failed to create ping" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pings = await prisma.ping.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json({ success: true, pings });
  } catch (error) {
    console.error("Ping fetch failed:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch pings" }, { status: 500 });
  }
}
