import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess, mockFetchNetworkError } from "../test/fixtures.ts";

describe("역 정보 로딩 실패 (useStations)", () => {
  it("요청이 실패하면 오류를 알리고 재시도 경로를 제공한다", async () => {
    mockFetchNetworkError(500);
    renderApp("/stations");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("역 정보를 불러오지 못했어요");
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  });

  it("다시 시도를 누르면 재요청해서 성공하면 목록이 나온다", async () => {
    const user = userEvent.setup();
    mockFetchNetworkError(500);
    renderApp("/stations");

    await screen.findByRole("alert");

    mockFetchSuccess();
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText(/교대/)).toBeInTheDocument();
  });

});
