import { loadRaw, normalizeName } from "@/lib/stations";

export async function GET() {
  const { travel, coords, transfers } = loadRaw();
  const key = (line: string, name: string) => `${line}호선 ${normalizeName(name)}`;

  const travelKeys = new Set(travel.map((r) => key(r[1], r[2])));
  const coordKeys = new Set(coords.map((r) => key(r[1], r[3])));
  const transferKeys = new Set(transfers.map((r) => key(r[1], r[2])));
  const stations = new Set(travel.map((r) => normalizeName(r[2])));

  return Response.json({
    stations: stations.size,
    missingCoords: [...travelKeys].filter((k) => !coordKeys.has(k)),
    coordsNotInTravel: [...coordKeys].filter((k) => !travelKeys.has(k)),
    transfersNotInTravel: [...transferKeys].filter((k) => !travelKeys.has(k)),
  });
}
