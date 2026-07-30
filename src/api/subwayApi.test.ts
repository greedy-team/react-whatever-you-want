import { describe, it, expect } from "vitest";
import { fetchStations } from "./subwayApi.ts";
import { mockFetchSuccess, mockFetchNetworkError, row } from "../test/fixtures.ts";

describe("fetchStations", () => {
  it("API 응답을 앱에서 쓰는 Station 형태로 변환한다", async () => {
    mockFetchSuccess([row("0331", "교대", "03호선", "Gyodae")]);

    const stations = await fetchStations();

    expect(stations).toEqual([
      {
        id: "0331",
        name: "교대",
        nameEng: "Gyodae",
        nameChn: "교대-chn",
        nameJpn: "교대-jpn",
        line: "3호선",
      },
    ]);
  });

  it("호선 번호 앞의 0을 제거한다", async () => {
    mockFetchSuccess([
      row("0101", "서울역", "01호선"),
      row("0901", "노량진", "09호선"),
      row("4301", "죽전", "수인분당선"),
    ]);

    const lines = (await fetchStations()).map((s) => s.line);

    expect(lines).toEqual(["1호선", "9호선", "수인분당선"]);
  });

  it("HTTP 응답이 실패하면 상태 코드를 담은 에러를 던진다", async () => {
    mockFetchNetworkError(503);

    await expect(fetchStations()).rejects.toThrow("네트워크 오류: 503");
  });

  it("API가 실패 코드를 주면 그 메시지를 그대로 에러로 전달한다", async () => {
    const { vi } = await import("vitest");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          SearchSTNBySubwayLineInfo: {
            list_total_count: 0,
            RESULT: { CODE: "INFO-200", MESSAGE: "해당하는 데이터가 없습니다." },
            row: [],
          },
        }),
      }),
    );

    await expect(fetchStations()).rejects.toThrow("해당하는 데이터가 없습니다.");
  });

  it("인증 실패처럼 본문이 없는 응답도 메시지를 찾아 에러로 전달한다", async () => {
    const { vi } = await import("vitest");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          RESULT: { CODE: "INFO-100", MESSAGE: "인증키가 유효하지 않습니다." },
        }),
      }),
    );

    await expect(fetchStations()).rejects.toThrow("인증키가 유효하지 않습니다.");
  });
});
