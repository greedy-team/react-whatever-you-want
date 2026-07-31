import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";

describe("없는 경로", () => {
  it("등록되지 않은 주소로 들어오면 404 화면을 보여준다", () => {
    renderApp("/이런페이지는없다");

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("홈으로 돌아가기를 누르면 홈으로 이동한다", async () => {
    const user = userEvent.setup();
    renderApp("/이런페이지는없다");

    await user.click(screen.getByRole("button", { name: /홈으로 돌아가기/ }));

    expect(screen.getByRole("button", { name: /시작/ })).toBeInTheDocument();
  });
});
