import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const artists = await prisma.nailArtist.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });
    return NextResponse.json(artists);
  } catch (error) {
    return NextResponse.json({ error: "获取美甲师失败" }, { status: 500 });
  }
}