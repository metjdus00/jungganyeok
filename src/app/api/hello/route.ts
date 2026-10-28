import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const file = path.join(process.cwd(), "data/raw/travel_time.csv");
  const text = await readFile(file, "utf-8");
  const rows = text.trim().split("\n").slice(1);
  const stations = new Set(rows.map((row) => row.split(",")[2].trim()));

  return Response.json({
    message: "안녕, 우리 딱 중간역!",
    rows: rows.length,
    stations: stations.size,
  });
}
