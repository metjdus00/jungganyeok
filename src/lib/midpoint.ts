import { buildGraph } from "./graph";
import { dijkstra } from "./dijkstra";
import { normalizeName } from "./stations";

export type Candidate = {
  station: string;
  maxMinutes: number; // 제일 오래 걸리는 사람의 시간
  totalMinutes: number; // 모두의 시간 합
  minutes: number[]; // 친구 순서대로 각자 시간
};

const graph = buildGraph(); // 서버가 켜질 때 한 번만 만들어요

// "2|강남" -> "강남"
const nameOf = (node: string) => node.split("|")[1];

export function findMidpoint(inputs: string[], limit = 5): Candidate[] {
  const names = inputs.map(normalizeName);

  // 친구마다: 출발역의 모든 호선에서 동시에 출발 (어느 호선을 타도 됨)
  const timesPerFriend = names.map((name) => {
    const starts = [...graph.keys()].filter((node) => nameOf(node) === name);
    if (starts.length === 0) throw new Error(`모르는 역이에요: ${name}`);

    // 같은 역의 여러 호선 중 가장 빨리 도착하는 시간
    const best = new Map<string, number>();
    for (const [node, seconds] of dijkstra(graph, starts)) {
      const station = nameOf(node);
      best.set(station, Math.min(best.get(station) ?? Infinity, seconds));
    }
    return best;
  });

  const ranked = [...timesPerFriend[0].keys()].map((station) => {
    const seconds = timesPerFriend.map((t) => t.get(station) ?? Infinity);
    return {
      station,
      seconds,
      max: Math.max(...seconds),
      total: seconds.reduce((a, b) => a + b, 0),
    };
  });

  // 1순위: 제일 먼 사람 시간이 짧은 순, 2순위: 전체 합이 작은 순 (초 단위로 비교)
  ranked.sort((a, b) => a.max - b.max || a.total - b.total);

  // 화면에 보여줄 때만 분으로 반올림
  const candidates: Candidate[] = ranked.map((r) => ({
    station: r.station,
    maxMinutes: Math.round(r.max / 60),
    totalMinutes: Math.round(r.total / 60),
    minutes: r.seconds.map((s) => Math.round(s / 60)),
  }));
  return candidates.slice(0, limit);
}
