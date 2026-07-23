import { describe, expect, it, vi } from "vitest";

describe("getStationNames", () => {
  it("역 이름의 중복을 제거하고 가나다순으로 반환한다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        subwayStationMaster: {
          RESULT: { CODE: "INFO-000" },
          row: [
            { BLDN_NM: "아차산(어린이대공원후문)" },
            { BLDN_NM: "강남" },
            { BLDN_NM: "아차산(어린이대공원후문)" },
          ],
        },
      }),
    } as Response);
    // 테스트끼리 역 이름 캐시를 공유하지 않도록 모듈을 새로 불러온다
    vi.resetModules();
    const { getStationNames } = await import("./subwayStations");

    await expect(getStationNames()).resolves.toEqual([
      "강남",
      "아차산(어린이대공원후문)",
    ]);
  });

  it("API가 실패 코드를 반환하면 Error를 던진다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        subwayStationMaster: {
          RESULT: {
            CODE: "INFO-200",
            MESSAGE: "해당하는 데이터가 없습니다",
          },
        },
      }),
    } as Response);
    // 테스트끼리 역 이름 캐시를 공유하지 않도록 모듈을 새로 불러온다
    vi.resetModules();
    const { getStationNames } = await import("./subwayStations");

    await expect(getStationNames()).rejects.toThrow(
      "지하철역 목록 조회 실패: 해당하는 데이터가 없습니다",
    );
  });
});

/*
npm run test -- src/api/subwayStations.test.ts

> react-whatever-you-want@0.0.0 test
> vitest run src/api/subwayStations.test.ts


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ src/api/subwayStations.test.ts (2 tests) 18ms
   ✓ getStationNames (2)
     ✓ 역 이름의 중복을 제거하고 가나다순으로 반환한다 17ms
     ✓ API가 실패 코드를 반환하면 Error를 던진다 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:39:47
   Duration  95ms (transform 24ms, setup 0ms, import 20ms, tests 18ms, environment 0ms)
*/
