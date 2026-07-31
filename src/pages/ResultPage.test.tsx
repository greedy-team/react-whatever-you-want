import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";

describe("결과 화면", () => {
  it("점수 정보 없이 접근하면 0점으로 보여준다", () => {
    renderApp("/result");

    expect(screen.getByRole("heading", { name: "운행 종료" })).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("처음으로 돌아가기를 누르면 홈으로 이동한다", async () => {
    const user = userEvent.setup();
    renderApp("/result");

    await user.click(screen.getByRole("button", { name: /처음으로/ }));

    expect(screen.getByRole("button", { name: /시작/ })).toBeInTheDocument();
  });
});
