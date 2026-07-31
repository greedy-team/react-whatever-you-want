import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "../test/renderApp.tsx";
import { mockFetchSuccess } from "../test/fixtures.ts";

describe("역 정보 로딩 (useStations)", () => {
  it("불러오는 동안 로딩 상태를 알리고, 완료되면 목록을 보여준다", async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    const pending = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    const { vi } = await import("vitest");
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pending));

    renderApp("/stations");

    expect(screen.getByRole("status")).toHaveTextContent("역 정보를 불러오는 중");

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        SearchSTNBySubwayLineInfo: {
          list_total_count: 1,
          RESULT: { CODE: "INFO-000", MESSAGE: "정상 처리되었습니다." },
          row: [
            {
              STATION_CD: "0331",
              STATION_NM: "교대",
              STATION_NM_ENG: "Gyodae",
              STATION_NM_CHN: "校大",
              STATION_NM_JPN: "キョデ",
              LINE_NUM: "03호선",
            },
          ],
        },
      }),
    });

    expect(await screen.findByText(/교대/)).toBeInTheDocument();
  });

  it("한 번 불러온 뒤에는 화면을 옮겨도 다시 요청하지 않는다", async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetchSuccess();

    renderApp("/stations");
    await screen.findByText(/교대/);
    const callsAfterFirstLoad = fetchMock.mock.calls.length;

    await user.click(screen.getByRole("button", { name: "메뉴 열기" }));
    await user.click(screen.getByRole("link", { name: /홈/ }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /시작/ })).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledTimes(callsAfterFirstLoad);
  });
});
