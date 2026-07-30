import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

describe("홈 화면", () => {
  it("게임 제목과 시작 버튼을 보여준다", () => {
    renderApp("/");

    expect(screen.getByRole("button", { name: /시작/ })).toBeInTheDocument();
  });

  it("호선 버튼을 누를 때마다 다음 호선으로 순환한다", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const lineButton = screen.getByRole("button", { name: /호선 :/ });
    expect(lineButton).toHaveTextContent("3호선");

    await user.click(lineButton);
    expect(lineButton).toHaveTextContent("4호선");

    await user.click(lineButton);
    expect(lineButton).toHaveTextContent("5호선");
  });

  it("마지막 호선에서 한 번 더 누르면 처음으로 돌아온다", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const lineButton = screen.getByRole("button", { name: /호선 :/ });
    for (let i = 0; i < 7; i += 1) {
      await user.click(lineButton);
    }
    expect(lineButton).toHaveTextContent("호선 : 전체 호선");
  });

  it("시작 버튼을 누르면 게임 화면으로 이동한다", async () => {
    mockFetchSuccess();
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("button", { name: /시작/ }));

    expect(await screen.findByLabelText("역 이름 입력")).toBeInTheDocument();
  });
});
