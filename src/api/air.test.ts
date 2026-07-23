import { describe, expect, it, vi } from "vitest";
import { getAir } from "./air";

describe("getAir", () => {
  it("API 응답을 대기질 요약으로 매핑한다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: {
          header: { resultCode: "00" },
          body: {
            items: [
              {
                pm10Value: "80",
                pm25Value: "40",
                pm10Grade: "3",
                pm25Grade: "2",
                dataTime: "2026-07-23 20:00",
              },
            ],
          },
        },
      }),
    } as Response);

    await expect(getAir()).resolves.toEqual({
      pm10: "80",
      pm25: "40",
      pm10Grade: 3,
      pm25Grade: 2,
      time: "2026-07-23 20:00",
      needMask: true,
    });
  });

  it("API가 실패 코드를 반환하면 ApiError를 던진다", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: {
          header: {
            resultCode: "99",
            resultMsg: "API 요청 실패",
          },
        },
      }),
    } as Response);

    await expect(getAir()).rejects.toMatchObject({
      name: "ApiError",
      code: "99",
    });
  });
});

/*

npm run test -- src/api/air.test.ts

> react-whatever-you-want@0.0.0 test
> vitest run src/api/air.test.ts


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ src/api/air.test.ts (2 tests) 2ms
   ✓ getAir (2)
     ✓ API 응답을 대기질 요약으로 매핑한다 1ms
     ✓ API가 실패 코드를 반환하면 ApiError를 던진다 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  20:53:39
   Duration  83ms (transform 23ms, setup 0ms, import 29ms, tests 2ms, environment 0ms)

*/
