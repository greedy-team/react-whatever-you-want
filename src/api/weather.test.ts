import { afterEach, describe, expect, it, vi } from "vitest";
import { getWeather } from "./weather";

describe("getWeather", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("API 응답을 날씨 요약으로 매핑한다", async () => {
    // 테스트 돌리는 날짜가 바뀌면 fcstDate랑 안 맞아서, 시간을 fixture 날짜로 고정
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 23, 12)); // 이거 월이 0부터 시작이라 7월은 6로 넣어야 함

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: {
          header: { resultCode: "00" },
          body: {
            items: {
              item: [
                { category: "TMN", fcstDate: "20260723", fcstValue: "20" },
                { category: "TMX", fcstDate: "20260723", fcstValue: "30" },
                { category: "POP", fcstDate: "20260723", fcstValue: "60" },
                { category: "PTY", fcstDate: "20260723", fcstValue: "1" },
              ],
            },
          },
        },
      }),
    } as Response);
    await expect(getWeather()).resolves.toEqual({
      minTemp: "20",
      maxTemp: "30",
      pop: 60,
      rain: true,
      needUmbrella: true,
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
    await expect(getWeather()).rejects.toMatchObject({
      message: "날씨 조회 실패: API 요청 실패",
      name: "ApiError",
      code: "99",
    });
  });
});

/*
npm run test -- src/api/weather.test.ts

> react-whatever-you-want@0.0.0 test
> vitest run src/api/weather.test.ts


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ src/api/weather.test.ts (2 tests) 4ms
   ✓ getWeather (2)
     ✓ API 응답을 날씨 요약으로 매핑한다 3ms
     ✓ API가 실패 코드를 반환하면 ApiError를 던진다 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  21:38:30
   Duration  99ms (transform 25ms, setup 0ms, import 32ms, tests 4ms, environment 0ms)
*/
