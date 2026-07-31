import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

describe("게임 타이머", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockFetchSuccess();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("60초에서 시작해 시간이 흐르면 남은 시간이 줄어든다", async () => {
    renderApp("/play");
    await screen.findByLabelText("역 이름 입력");
    await act(async () => {});

    const timer = screen.getByRole("timer");
    expect(timer).toHaveTextContent("60s");

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(timer).toHaveTextContent("55s");
  });

  it("남은 시간이 10초 이하가 되면 스크린리더에 한 번 알린다", async () => {
    renderApp("/play");
    await screen.findByLabelText("역 이름 입력");

    expect(screen.queryByText("10초 남았습니다")).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(51000);
    });

    expect(screen.getByText("10초 남았습니다")).toBeInTheDocument();
  });

  it("시간이 다 되면 결과 화면으로 이동한다", async () => {
    renderApp("/play");
    await screen.findByLabelText("역 이름 입력");

    await act(async () => {
      vi.advanceTimersByTime(61000);
    });

    await waitFor(() =>
      expect(screen.getByText("운행 종료")).toBeInTheDocument(),
    );
  });

  it("일시정지 중에는 시간이 줄어들지 않는다", async () => {
    renderApp("/play");
    await screen.findByLabelText("역 이름 입력");

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });
    const timer = screen.getByRole("timer");
    expect(timer).toHaveTextContent("55s");

    await act(async () => {
      screen.getByRole("button", { name: "일시정지" }).click();
    });
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(timer).toHaveTextContent("55s");
  });
});
