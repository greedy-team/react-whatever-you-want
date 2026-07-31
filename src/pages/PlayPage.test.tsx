import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

function currentStationName(): string {
  const el = document.querySelector(".nameplate-name");
  return el?.textContent ?? "";
}

function score(): number {
  const el = document.querySelector(".score-num");
  return Number(el?.textContent ?? "-1");
}

describe("게임 화면", () => {
  beforeEach(() => {
    mockFetchSuccess();
  });

  it("역 이름을 정확히 입력하면 점수가 오르고 다음 역이 나온다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    const input = await screen.findByLabelText("역 이름 입력");
    const first = currentStationName();
    expect(score()).toBe(0);

    await user.type(input, first);

    await waitFor(() => expect(score()).toBe(1));
    expect(screen.getByLabelText("역 이름 입력")).toHaveValue("");
  });

  it("틀린 답으로 Enter를 치면 입력창이 비워지고 점수는 그대로다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    const input = await screen.findByLabelText("역 이름 입력");
    await user.type(input, "존재하지않는역{Enter}");

    expect(input).toHaveValue("");
    expect(score()).toBe(0);
  });

  it("틀린 답으로 Enter를 치면 입력창에 흔들림 효과가 붙는다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    const input = await screen.findByLabelText("역 이름 입력");
    await user.type(input, "존재하지않는역{Enter}");

    expect(input).toHaveClass("shake");
  });

  it("선택한 호선의 역만 문제로 출제한다", async () => {
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");

    expect(["교대", "남부터미널", "양재"]).toContain(currentStationName());
  });

  it("ESC를 누르면 일시정지 메뉴가 열리고 다시 누르면 닫힌다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "일시정지 메뉴" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("일시정지 버튼을 눌러도 메뉴가 열린다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");
    await user.click(screen.getByRole("button", { name: "일시정지" }));

    expect(screen.getByRole("dialog", { name: "일시정지 메뉴" })).toBeInTheDocument();
  });

  it("일시정지가 열리면 첫 버튼으로 포커스가 옮겨가고 닫히면 입력창으로 돌아온다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");
    await user.keyboard("{Escape}");

    const resumeButton = screen.getByRole("button", { name: /계속하기/ });
    await waitFor(() => expect(resumeButton).toHaveFocus());

    await user.click(resumeButton);
    await waitFor(() =>
      expect(screen.getByLabelText("역 이름 입력")).toHaveFocus(),
    );
  });

  it("일시정지 중에는 입력이 점수에 반영되지 않는다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    const input = await screen.findByLabelText("역 이름 입력");
    const name = currentStationName();

    await user.keyboard("{Escape}");
    await user.type(input, name);

    expect(score()).toBe(0);
  });

  it("다시 시작을 누르면 점수가 0으로 초기화된다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    const input = await screen.findByLabelText("역 이름 입력");
    await user.type(input, currentStationName());
    await waitFor(() => expect(score()).toBe(1));

    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /다시 시작/ }));

    expect(score()).toBe(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("메인 화면으로를 누르면 홈으로 이동한다", async () => {
    const user = userEvent.setup();
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /메인 화면으로/ }));

    expect(screen.getByRole("button", { name: /시작/ })).toBeInTheDocument();
  });
});
