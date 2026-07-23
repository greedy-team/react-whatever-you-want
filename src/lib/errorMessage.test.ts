import { describe, expect, it } from "vitest";
import { errorMessage } from "./errorMessage";

describe("errorMessage", () => {
  it("Error 객체의 메시지를 반환한다", () => {
    expect(errorMessage(new Error("API의 정보를 불러오지 못했습니다"))).toBe(
      "API의 정보를 불러오지 못했습니다",
    );
  });

  it("Error가 아니면 기본 메시지를 반환한다", () => {
    expect(errorMessage("문자열 오류")).toBe("알 수 없는 오류");
  });
});

/* 
npm run dev 결과

 npm run test

> react-whatever-you-want@0.0.0 test
> vitest run


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ src/lib/errorMessage.test.ts (2 tests) 1ms
   ✓ errorMessage (2)
     ✓ Error 객체의 메시지를 반환한다 1ms
     ✓ Error가 아니면 기본 메시지를 반환한다 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  15:28:48
   Duration  85ms (transform 17ms, setup 0ms, import 23ms, tests 1ms, environment 0ms)
   */
