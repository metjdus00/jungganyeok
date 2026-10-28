import { buildGraph } from "@/lib/graph";

export async function GET() {
  const graph = buildGraph();

  let edges = 0;
  for (const list of graph.values()) edges += list.length;

  // 강남에서 출발해서 모든 역에 갈 수 있는지 확인
  const seen = new Set(["2|강남"]);
  const stack = ["2|강남"];
  while (stack.length) {
    const node = stack.pop()!;
    for (const edge of graph.get(node)!) {
      if (!seen.has(edge.to)) {
        seen.add(edge.to);
        stack.push(edge.to);
      }
    }
  }

  return Response.json({
    nodes: graph.size,
    edges: edges / 2,
    reachableFromGangnam: seen.size,
    gangnamNeighbors: graph.get("2|강남"),
  });
}
