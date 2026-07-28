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

  it("UTC 러너에서 돌려도 KST 기준 날짜와 최저기온이 있는 회차로 조회한다", async () => {
    // Actions 크론(0 22 * * *)이 시작 할 때 = KST 2026-07-26 07:00
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-25T22:00:00Z"));

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        response: {
          header: { resultCode: "00" },
          body: {
            items: {
              item: [
                { category: "TMN", fcstDate: "20260725", fcstValue: "22" },
                { category: "TMN", fcstDate: "20260726", fcstValue: "26" },
                { category: "TMX", fcstDate: "20260726", fcstValue: "32" },
              ],
            },
          },
        },
      }),
    } as Response);
    global.fetch = fetchMock;

    const weather = await getWeather();

    const params = new URL(fetchMock.mock.calls[0][0]).searchParams;
    // 0500 이후 회차엔 TMN이 없어서, 최신 회차가 아니라 어제 2300 회차로 조회해야 한다
    expect(params.get("base_date")).toBe("20260725");
    expect(params.get("base_time")).toBe("2300");
    expect(weather.minTemp).toBe("26");
    expect(weather.maxTemp).toBe("32");
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
