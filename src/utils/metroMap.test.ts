import { describe, it, expect, afterEach, vi } from "vitest";
import {
  randomEdgePoint,
  snapDirToCenter,
  buildLinePoints,
  createLines,
  createTrains,
} from "./metroMap.ts";

const W = 1000;
const H = 800;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("randomEdgePoint", () => {
  it("항상 화면 바깥 가장자리에서 시작한다", () => {
    for (let i = 0; i < 200; i += 1) {
      const p = randomEdgePoint(W, H);
      const outside =
        p.y === -100 || p.x === W + 100 || p.y === H + 100 || p.x === -100;
      expect(outside).toBe(true);
    }
  });

  it("네 방향의 가장자리를 모두 사용한다", () => {
    const edges = new Set<string>();
    for (let i = 0; i < 500; i += 1) {
      const p = randomEdgePoint(W, H);
      if (p.y === -100) edges.add("top");
      else if (p.x === W + 100) edges.add("right");
      else if (p.y === H + 100) edges.add("bottom");
      else edges.add("left");
    }
    expect(edges.size).toBe(4);
  });
});

describe("snapDirToCenter", () => {
  it("방향을 45도 단위의 정수 배수로만 돌려준다", () => {
    for (let i = 0; i < 200; i += 1) {
      const dir = snapDirToCenter(randomEdgePoint(W, H), W, H);
      expect(Number.isInteger(dir)).toBe(true);
    }
  });

  it("왼쪽 바깥에서 출발하면 오른쪽을 향한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const dir = snapDirToCenter({ x: -100, y: H / 2 }, W, H);

    expect(dir).toBe(0);
  });
});

describe("buildLinePoints", () => {
  it("시작점을 포함해 5~7개의 점으로 이뤄진다", () => {
    for (let i = 0; i < 100; i += 1) {
      const points = buildLinePoints(W, H);
      expect(points.length).toBeGreaterThanOrEqual(5);
      expect(points.length).toBeLessThanOrEqual(7);
    }
  });

  it("이웃한 점 사이 거리는 200~500px 범위를 지킨다", () => {
    const points = buildLinePoints(W, H);

    for (let i = 1; i < points.length; i += 1) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      const dist = Math.hypot(dx, dy);
      expect(dist).toBeGreaterThanOrEqual(199.9);
      expect(dist).toBeLessThanOrEqual(500.1);
    }
  });
});

describe("createLines", () => {
  it("화면이 넓을수록 노선을 더 많이 만든다", () => {
    expect(createLines(1000, H, ["#fff"])).toHaveLength(6);
    expect(createLines(2000, H, ["#fff"])).toHaveLength(10);
  });

  it("팔레트를 순환하며 색을 배정한다", () => {
    const colors = ["#aaa", "#bbb"];

    const lines = createLines(1000, H, colors);

    expect(lines.map((l) => l.color)).toEqual([
      "#aaa", "#bbb", "#aaa", "#bbb", "#aaa", "#bbb",
    ]);
  });
});

describe("createTrains", () => {
  it("노선 수만큼 만들고 각 열차는 자기 노선을 가리킨다", () => {
    const trains = createTrains(4);

    expect(trains).toHaveLength(4);
    expect(trains.map((t) => t.lineIndex)).toEqual([0, 1, 2, 3]);
  });

  it("열차 속도는 정해진 범위 안에서 서로 다르게 부여된다", () => {
    const trains = createTrains(50);

    for (const train of trains) {
      expect(train.speed).toBeGreaterThanOrEqual(0.0015);
      expect(train.speed).toBeLessThanOrEqual(0.003);
    }
    expect(new Set(trains.map((t) => t.speed)).size).toBeGreaterThan(1);
  });
});
