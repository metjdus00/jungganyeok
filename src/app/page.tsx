"use client";

import { useState } from "react";

type Candidate = {
  station: string;
  maxMinutes: number;
  totalMinutes: number;
  minutes: number[];
};

const COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#D4537E", "#378ADD", "#BA7517"];
const MAX_FRIENDS = 6;

export default function Home() {
  const [inputs, setInputs] = useState(["", ""]);
  const [searched, setSearched] = useState<string[]>([]);
  const [results, setResults] = useState<Candidate[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(index: number, value: string) {
    setInputs(inputs.map((v, i) => (i === index ? value : v)));
  }

  async function search() {
    const stations = inputs.map((s) => s.trim()).filter(Boolean);
    if (stations.length < 2) {
      setError("출발역을 2개 이상 넣어주세요");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/midpoint?stations=${encodeURIComponent(stations.join(","))}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setResults(null);
        return;
      }
      setSearched(stations);
      setResults(data.candidates);
    } catch {
      setError("잠깐 문제가 생겼어요. 다시 해볼까요?");
    } finally {
      setLoading(false);
    }
  }

  const best = results?.[0];

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 py-10">
      <h1 className="text-2xl font-semibold">우리 딱 중간역</h1>
      <p className="mt-1 text-sm text-neutral-500">아무도 억울하지 않은 약속 장소</p>

      <div className="mt-8 flex flex-col gap-3">
        {inputs.map((value, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <input
              value={value}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder={i === 0 ? "강남" : "출발역"}
              className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-100"
            />
            {inputs.length > 2 && (
              <button
                onClick={() => setInputs(inputs.filter((_, j) => j !== i))}
                className="px-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                aria-label="친구 빼기"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {inputs.length < MAX_FRIENDS && (
          <button
            onClick={() => setInputs([...inputs, ""])}
            className="rounded-lg border border-dashed border-neutral-300 py-2 text-sm text-neutral-500 dark:border-neutral-700"
          >
            + 친구 추가
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={search}
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-neutral-900 py-3 text-white disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {loading ? "찾는 중…" : "중간역 찾기"}
      </button>

      {best && (
        <section className="mt-10">
          <p className="text-sm text-neutral-500">오늘의 딱 중간역</p>
          <h2 className="mt-1 text-3xl font-semibold">{best.station}</h2>
          <p className="mt-1 text-sm text-neutral-500">제일 먼 사람도 {best.maxMinutes}분</p>

          <div className="mt-6 flex flex-col gap-4">
            {searched.map((name, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span>{best.minutes[i]}분</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(best.minutes[i] / Math.max(best.maxMinutes, 1)) * 100}%`,
                      backgroundColor: COLORS[i],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {results && results.length > 1 && (
            <div className="mt-8">
              <p className="text-sm text-neutral-500">다른 후보</p>
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {results.slice(1).map((c) => (
                  <li key={c.station} className="flex justify-between">
                    <span>{c.station}</span>
                    <span className="text-neutral-500">최대 {c.maxMinutes}분</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
