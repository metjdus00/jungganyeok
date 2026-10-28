import { loadRaw, normalizeName } from "./stations";

// 노드 이름 형식: "2|강남" (호선|역이름). 같은 역도 호선마다 다른 노드예요.
export type Edge = { to: string; seconds: number };
export type Graph = Map<string, Edge[]>;

// 지선(갈라지는 노선)은 CSV에서 바로 앞 줄이 실제 이전 역이 아니라서 직접 알려줘요.
const BRANCH_FROM: Record<string, string> = {
  "2|용답": "성수", // 2호선 성수지선
  "2|도림천": "신도림", // 2호선 신정지선
  "5|둔촌동": "강동", // 5호선 마천 방면
};

const DEFAULT_TRANSFER_SECONDS = 180; // 환승 시간이 없을 때 3분

function toSeconds(mmss: string): number {
  const [m, s] = mmss.split(":").map(Number);
  return m * 60 + s;
}

function addEdge(graph: Graph, a: string, b: string, seconds: number) {
  for (const [from, to] of [[a, b], [b, a]]) {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push({ to, seconds });
  }
}

export function buildGraph(): Graph {
  const { travel, transfers } = loadRaw();
  const graph: Graph = new Map();

  // 1) 같은 호선의 이웃 역끼리 연결
  let prevNode: string | null = null;
  let prevLine: string | null = null;
  for (const row of travel) {
    const line = row[1];
    const node = `${line}|${normalizeName(row[2])}`;
    if (!graph.has(node)) graph.set(node, []);
    if (line !== prevLine) prevNode = null;

    const branch = BRANCH_FROM[node];
    const from = branch ? `${line}|${branch}` : prevNode;
    const seconds = toSeconds(row[3]);
    if (from && seconds > 0) addEdge(graph, from, node, seconds);

    prevNode = node;
    prevLine = line;
  }

  // 2) 환승 시간 표 만들기 (1~8호선끼리만)
  const transferSeconds = new Map<string, number>();
  for (const row of transfers) {
    const match = row[3].match(/^([1-8])호선$/);
    if (!match) continue;
    const name = normalizeName(row[2]);
    const key = [`${row[1]}|${name}`, `${match[1]}|${name}`].sort().join("~");
    const seconds = toSeconds(row[5]);
    transferSeconds.set(key, Math.min(transferSeconds.get(key) ?? Infinity, seconds));
  }

  // 3) 같은 이름의 역을 호선끼리 환승 간선으로 연결
  const linesByName = new Map<string, string[]>();
  for (const node of graph.keys()) {
    const [line, name] = node.split("|");
    if (!linesByName.has(name)) linesByName.set(name, []);
    linesByName.get(name)!.push(line);
  }
  for (const [name, lines] of linesByName) {
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const a = `${lines[i]}|${name}`;
        const b = `${lines[j]}|${name}`;
        const key = [a, b].sort().join("~");
        addEdge(graph, a, b, transferSeconds.get(key) ?? DEFAULT_TRANSFER_SECONDS);
      }
    }
  }

  return graph;
}
