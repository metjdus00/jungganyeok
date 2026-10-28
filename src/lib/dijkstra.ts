import type { Graph } from "./graph";

// 가장 작은 값을 빨리 꺼내는 자료구조 (최소 힙)
class MinHeap {
  private items: [number, string][] = [];

  get size() {
    return this.items.length;
  }

  push(item: [number, string]) {
    const a = this.items;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (a[parent][0] <= a[i][0]) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }

  pop(): [number, string] {
    const a = this.items;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let smallest = i;
        if (l < a.length && a[l][0] < a[smallest][0]) smallest = l;
        if (r < a.length && a[r][0] < a[smallest][0]) smallest = r;
        if (smallest === i) break;
        [a[smallest], a[i]] = [a[i], a[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

// starts에 있는 노드들에서 출발해서 모든 노드까지의 최단 시간(초)
export function dijkstra(graph: Graph, starts: string[]): Map<string, number> {
  const dist = new Map<string, number>();
  const heap = new MinHeap();
  for (const s of starts) {
    dist.set(s, 0);
    heap.push([0, s]);
  }

  while (heap.size > 0) {
    const [d, node] = heap.pop();
    if (d > (dist.get(node) ?? Infinity)) continue; // 이미 더 짧은 길을 찾음

    for (const edge of graph.get(node) ?? []) {
      const next = d + edge.seconds;
      if (next < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, next);
        heap.push([next, edge.to]);
      }
    }
  }
  return dist;
}
