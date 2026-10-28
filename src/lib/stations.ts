import { readFileSync } from "node:fs";
import path from "node:path";

// 같은 역인데 파일마다 이름이 다른 경우
const ALIASES: Record<string, string> = {
  총신대입구: "이수", // 4호선 총신대입구 = 7호선 이수 (같은 환승역)
  뚝섬유원지: "자양", // 7호선 역 이름 변경
};

export function normalizeName(raw: string): string {
  const name = raw.replace(/\s+/g, "").replace(/역$/, "");
  return ALIASES[name] ?? name;
}

function readCsv(file: string): string[][] {
  const text = readFileSync(path.join(process.cwd(), "data/raw", file), "utf-8");
  return text.trim().split(/\r?\n/).slice(1).map((line) => line.split(","));
}

export function loadRaw() {
  return {
    travel: readCsv("travel_time.csv"),
    coords: readCsv("coordinates.csv"),
    transfers: readCsv("transfer.csv"),
  };
}
