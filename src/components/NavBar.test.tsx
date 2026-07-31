import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

describe("내비게이션", () => {
  it("처음에는 메뉴가 닫혀 있고 버튼으로 열고 닫을 수 있다", async () => {
    const user = userEvent.setup();
    renderApp("/");

    const toggle = screen.getByRole("button", { name: "메뉴 열기" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: /역 정보/ })).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("link", { name: /역 정보/ })).toBeInTheDocument();
  });

  it("메뉴로 역 정보 화면에 이동할 수 있고 이동 후 메뉴는 닫힌다", async () => {
    mockFetchSuccess();
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    await user.click(screen.getByRole("link", { name: /역 정보/ }));

    expect(await screen.findByRole("heading", { name: "역 정보" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "메뉴 열기" })).toBeInTheDocument();
  });

  it("게임 중에는 몰입을 위해 내비게이션을 숨긴다", async () => {
    mockFetchSuccess();
    renderApp("/play");

    await screen.findByLabelText("역 이름 입력");

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
