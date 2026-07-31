import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

describe("역 정보 화면", () => {
  beforeEach(() => {
    mockFetchSuccess();
  });

  it("전체 역 목록과 개수를 보여준다", async () => {
    renderApp("/stations");

    expect(await screen.findByText("6개 역")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
  });

  it("호선 필터를 누르면 해당 호선 역만 남는다", async () => {
    const user = userEvent.setup();
    renderApp("/stations");
    await screen.findByText("6개 역");

    await user.click(screen.getByRole("button", { name: "2호선" }));

    expect(screen.getByText("2개 역")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText(/강남/)).toBeInTheDocument();
    expect(screen.queryByText(/교대/)).not.toBeInTheDocument();
  });

  it("선택된 필터만 눌린 상태로 표시된다", async () => {
    const user = userEvent.setup();
    renderApp("/stations");
    await screen.findByText("6개 역");

    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "3호선" }));

    expect(screen.getByRole("button", { name: "3호선" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "전체" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("API에 있는 호선만 필터 후보로 만든다", async () => {
    renderApp("/stations");
    await screen.findByText("6개 역");

    const filters = screen
      .getByRole("group", { name: "호선 필터" })
      .querySelectorAll("button");

    expect([...filters].map((b) => b.textContent)).toEqual([
      "전체",
      "3호선",
      "2호선",
      "수인분당선",
    ]);
  });
});
