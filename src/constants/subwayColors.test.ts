import { describe, it, expect } from "vitest";
import { getLineColor, subwayColors, DEFAULT_LINE_COLOR } from "./subwayColors.ts";

describe("getLineColor", () => {
  it("등록된 호선은 지정된 색을 돌려준다", () => {
    expect(getLineColor("3호선")).toBe("#F06F28");
    expect(getLineColor("수인분당선")).toBe("#F5A200");
  });

  it("등록되지 않은 호선은 기본 색으로 안전하게 대체한다", () => {
    expect(getLineColor("없는호선")).toBe(DEFAULT_LINE_COLOR);
    expect(getLineColor("")).toBe(DEFAULT_LINE_COLOR);
  });

  it("모든 색상 값은 유효한 HEX 코드 형식이다", () => {
    for (const color of Object.values(subwayColors)) {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});
