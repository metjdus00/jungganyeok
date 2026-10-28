"use client";

import { useState } from "react";

type Friend = { name: string; minutes: number };
type Template = "A" | "B" | "C";

// 카드 3종이 함께 쓰는 데이터 (디자인만 다르고 내용은 같아요)
type CardData = {
  station: string;
  friends: Friend[];
  farthest: Friend;
  spread: number; // 제일 먼 사람과 제일 가까운 사람의 차이(분)
  whenText: string;
  date: Date;
};

const TEMPLATES: { id: Template; label: string }[] = [
  { id: "A", label: "공평 인증서" },
  { id: "B", label: "우정 승차권" },
  { id: "C", label: "억울함 결과지" },
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatWhen(value: string): string {
  if (!value) return "날짜 미정 (단톡방에서 정하기)";
  const d = new Date(value);
  const h = d.getHours();
  const period = h < 12 ? "오전" : h < 18 ? "오후" : "저녁";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const minute = d.getMinutes() ? ` ${d.getMinutes()}분` : "";
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일 ${period} ${hour}시${minute}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function statusOf(minutes: number) {
  if (minutes <= 25) return { label: "정상", color: "#3B6D11" };
  if (minutes <= 40) return { label: "경계", color: "#854F0B" };
  return { label: "위험", color: "#A32D2D" };
}

function CertificateCard({ station, friends, farthest, spread, whenText, date }: CardData) {
  return (
    <div
      className="relative rounded-xl border-2 p-5"
      style={{ background: "#FAEEDA", borderColor: "#854F0B", color: "#412402" }}
    >
      <p className="text-center text-xs tracking-widest" style={{ color: "#854F0B" }}>
        제 {date.getFullYear()}-{pad(date.getMonth() + 1)}
        {pad(date.getDate())} 호
      </p>
      <p className="mt-2 text-center font-serif text-2xl tracking-[0.3em]">공평인증서</p>
      <p className="mt-4 text-sm leading-relaxed" style={{ color: "#633806" }}>
        위 {friends.length}명은 아래 장소에서 만남에 있어 누구도 억울하지 않음을 다익스트라의 이름으로
        증명함.
      </p>
      <p className="mt-5 text-center text-3xl font-semibold">{station}</p>
      <p className="mt-1 text-center text-sm" style={{ color: "#854F0B" }}>
        {whenText}
      </p>
      <p className="mt-5 pr-20 text-xs leading-relaxed" style={{ color: "#633806" }}>
        억울 지수: {spread}분 차이
        <br />
        제일 먼 사람: {farthest.name} ({farthest.minutes}분,{" "}
        {farthest.minutes <= 40 ? "참을 만함" : "치킨 사줘야 함"})
      </p>
      <div
        className="absolute bottom-4 right-4 flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-2 text-center text-xs leading-tight"
        style={{ borderColor: "#A32D2D", color: "#A32D2D" }}
      >
        공평
        <br />
        인증
      </div>
    </div>
  );
}

function TicketCard({ station, friends, whenText }: CardData) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ background: "#E1F5EE", borderColor: "#0F6E56", color: "#04342C" }}
    >
      <div
        className="flex justify-between px-4 py-2 text-sm"
        style={{ background: "#0F6E56", color: "#E1F5EE" }}
      >
        <span>우정 1회권</span>
        <span>편도 아님</span>
      </div>
      <div className="p-4">
        <p className="text-xs" style={{ color: "#0F6E56" }}>
          출발
        </p>
        <p className="text-sm">{friends.map((f) => f.name).join(" · ")}</p>
        <p className="mt-3 text-xs" style={{ color: "#0F6E56" }}>
          도착
        </p>
        <p className="text-3xl font-semibold">{station}</p>
        <p className="text-sm" style={{ color: "#0F6E56" }}>
          {whenText}
        </p>
        <div className="-mx-4 my-4 border-t-2 border-dashed" style={{ borderColor: "#5DCAA5" }} />
        <p className="text-sm leading-relaxed" style={{ color: "#085041" }}>
          운임: 우정으로 결제
          <br />
          환승: 마음까지 무료
          <br />
          유효기간: 단톡방이 터지기 전까지
        </p>
        <p className="mt-3 rounded-md px-3 py-2 text-sm" style={{ background: "#9FE1CB", color: "#085041" }}>
          지각 시 벌칙: 전원 아아 쏘기
        </p>
      </div>
    </div>
  );
}

function ReportCard({ station, friends, farthest, whenText, date }: CardData) {
  return (
    <div
      className="rounded-xl border p-5 font-mono"
      style={{ background: "#FFFFFF", borderColor: "#B4B2A9", color: "#2C2C2A" }}
    >
      <p className="text-xs" style={{ color: "#5F5E5A" }}>
        억울함 정밀 검사 결과
      </p>
      <p className="border-b border-dashed pb-2 text-xs" style={{ color: "#5F5E5A", borderColor: "#B4B2A9" }}>
        검사일 {date.getFullYear()}.{pad(date.getMonth() + 1)}.{pad(date.getDate())}
      </p>
      <ul className="mt-3 space-y-1 text-sm">
        {friends.map((f, i) => {
          const status = statusOf(f.minutes);
          return (
            <li key={i} className="flex justify-between">
              <span>{f.name}</span>
              <span style={{ color: status.color }}>
                {f.minutes}분 {status.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="my-3 border-t border-dashed" style={{ borderColor: "#B4B2A9" }} />
      <p className="text-xs" style={{ color: "#5F5E5A" }}>
        처방 장소
      </p>
      <p className="font-sans text-2xl font-semibold">{station}</p>
      <p className="text-xs" style={{ color: "#5F5E5A" }}>
        {whenText} · 1회 복용
      </p>
      <p className="mt-3 text-xs leading-relaxed">
        소견: {farthest.name}에서 오는 환자가 가장 멀지만
        <br />
        밥값 면제로 치료 가능
      </p>
      <p className="mt-2 text-xs" style={{ color: "#888780" }}>
        * 본 결과는 다익스트라 박사가 판독함
      </p>
    </div>
  );
}

type Props = { station: string; friends: Friend[] };

export default function PromiseCardMaker({ station, friends }: Props) {
  const [template, setTemplate] = useState<Template>("A");
  const [when, setWhen] = useState("");

  const minutes = friends.map((f) => f.minutes);
  const card: CardData = {
    station,
    friends,
    farthest: friends.reduce((a, b) => (b.minutes > a.minutes ? b : a)),
    spread: Math.max(...minutes) - Math.min(...minutes),
    whenText: formatWhen(when),
    date: when ? new Date(when) : new Date(),
  };

  return (
    <section className="mt-12">
      <p className="text-sm text-neutral-500">약속 카드 만들기</p>
      <input
        type="datetime-local"
        value={when}
        onChange={(e) => setWhen(e.target.value)}
        className="mt-2 w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700"
      />
      <div className="mt-3 flex gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`flex-1 rounded-lg border px-2 py-2 text-sm ${
              template === t.id
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-300 dark:border-neutral-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {template === "A" && <CertificateCard {...card} />}
        {template === "B" && <TicketCard {...card} />}
        {template === "C" && <ReportCard {...card} />}
      </div>
    </section>
  );
}
