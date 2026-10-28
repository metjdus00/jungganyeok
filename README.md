# 우리 딱 중간역 (Our Perfect Midpoint Station)

Find the fairest Seoul subway station for friends to meet — the one where the person with the longest trip travels as little as possible.

## How it works
- Seoul Metro Lines 1–8 (276 stations) modeled as a graph: stations are nodes, travel times are edges, transfers add a time penalty.
- Runs Dijkstra from each friend's starting station, then picks the station that minimizes the maximum travel time (ties broken by total travel time).

## Tech stack
Next.js · TypeScript · Tailwind CSS (planned: PostgreSQL, Kakao Local API, AWS, GitHub Actions)

## Data
Seoul Open Data Plaza — Seoul Metro travel times, station coordinates, and transfer info.

## Status
🚧 In progress
