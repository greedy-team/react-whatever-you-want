import { describe, expect, it } from "vitest";
import { buildSectionText, truncateMessage } from "./briefingMessage";

describe("truncateMessage", () => {
  it("200자 이하의 문자열은 그대로 반환한다", () => {
    const message = "a".repeat(200);
    expect(truncateMessage(message)).toBe(message);
  });

  it("200자를 초과하는 문자열은 197자까지 잘라내고 '...'을 붙인다", () => {
    const message = "a".repeat(250);
    expect(truncateMessage(message)).toBe("a".repeat(197) + "...");
  });
});

describe("buildSectionText", () => {
  it("조회에 성공하면 라벨과 조회 결과를 반환한다", async () => {
    await expect(buildSectionText("☔", async () => "맑음")).resolves.toBe(
      "☔ 맑음",
    );
  });

  it("조회에 실패하면 라벨과 실패 메시지를 반환한다", async () => {
    await expect(
      buildSectionText("☔", async () => {
        throw new Error("날씨 조회 실패");
      }),
    ).resolves.toBe("☔ 조회 실패");
  });
});

/*
 npm run test -- scripts/briefingMessage.test.ts

> react-whatever-you-want@0.0.0 test
> vitest run scripts/briefingMessage.test.ts


 RUN  v4.1.10 /Users/luca/workspace/greedy/react-whatever-you-want

 ✓ scripts/briefingMessage.test.ts (4 tests) 2ms
   ✓ truncateMessage (2)
     ✓ 200자 이하의 문자열은 그대로 반환한다 1ms
     ✓ 200자를 초과하는 문자열은 197자까지 잘라내고 '...'을 붙인다 0ms
   ✓ buildSectionText (2)
     ✓ 조회에 성공하면 라벨과 조회 결과를 반환한다 0ms
     ✓ 조회에 실패하면 라벨과 실패 메시지를 반환한다 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  02:47:55
   Duration  484ms (transform 18ms, setup 0ms, import 24ms, tests 2ms, environment 390ms)
*/
