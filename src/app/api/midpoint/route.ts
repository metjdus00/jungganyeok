import { NextRequest } from "next/server";
import { findMidpoint } from "@/lib/midpoint";

export async function GET(request: NextRequest) {
  const stations = (request.nextUrl.searchParams.get("stations") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (stations.length < 2) {
    return Response.json({ error: "출발역을 2개 이상 넣어주세요" }, { status: 400 });
  }

  try {
    return Response.json({ stations, candidates: findMidpoint(stations) });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
