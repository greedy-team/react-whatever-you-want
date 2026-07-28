import { describe, expect, it, vi } from "vitest";
import { getArrivals } from "./subway";

describe("getArrivals", () => {
  it("아차산역 도착정보를 Arrival 목록으로 매핑한다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        errorMessage: { code: "INFO-000" },
        realtimeArrivalList: [
          {
            subwayId: "1005",
            updnLine: "상행",
            trainLineNm: "방화행 - 군자방면",
            arvlMsg2: "전역 출발",
            barvlDt: "120",
          },
        ],
      }),
    } as Response);

    await expect(getArrivals("아차산")).resolves.toEqual([
      {
        lineId: "1005",
        direction: "상행",
        destination: "방화행 - 군자방면",
        message: "전역 출발",
        seconds: 120,
      },
    ]);
  });

  it("API가 실패 코드를 반환하면 ApiError를 던진다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        errorMessage: {
          code: "INFO-200",
          message: "해당하는 데이터가 없습니다",
        },
      }),
    } as Response);

    await expect(getArrivals("아차산")).rejects.toMatchObject({
      name: "ApiError",
      message: "지하철 조회 실패: 해당하는 데이터가 없습니다",
      code: "INFO-200",
    });
  });
});

/*
npm run test -- src/api/subway.test.ts

> react-whatever-you-want@0.0.0 test
> vitest run src/api/subway.test.ts


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ src/api/subway.test.ts (2 tests) 2ms
   ✓ getArrivals (2)
     ✓ 아차산역 도착정보를 Arrival 목록으로 매핑한다 1ms
     ✓ API가 실패 코드를 반환하면 ApiError를 던진다 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:03:01
   Duration  94ms (transform 24ms, setup 0ms, import 32ms, tests 2ms, environment 0ms)
*/
