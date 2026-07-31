import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResultPage from "./ResultPage";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("ResultPage - 영화 추천 결과 및 인터랙션 테스트", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("API 응답으로 받은 추천 영화 정보를 화면에 출력한다", async () => {
    // globalThis.fetch 자체를 모킹하여 실제 네트워크 요청 차단
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        page: 1,
        results: [{ id: 1, title: "인터스텔라", genre: "sf", era: "2010s" }],
        total_pages: 1,
        total_results: 1,
      }),
    } as Response);

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={["/result/random?genre=sf&era=2010s"]}>
          <ResultPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText("인터스텔라")).toBeInTheDocument();
  });

  it("보관함 저장 클릭 시 알림창이 뜨고, 재추첨 버튼 클릭 시 에러 없이 로직이 동작한다", async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        page: 1,
        results: [
          { id: 1, title: "영화 A", genre: "action", era: "2020s" },
          { id: 2, title: "영화 B", genre: "action", era: "2020s" },
        ],
        total_pages: 1,
        total_results: 2,
      }),
    } as Response);

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter
          initialEntries={["/result/random?genre=action&era=2020s"]}
        >
          <ResultPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const saveBtn = await screen.findByRole("button", {
      name: /보관함에 저장하기/i,
    });
    await user.click(saveBtn);
    expect(alertSpy).toHaveBeenCalledWith(
      "보관함에 성공적으로 저장되었습니다!",
    );

    // aria-label 문구("조건에 맞는 다른 영화 다시 추천받기")에 맞춘 매칭 정규식
    const repickBtn = await screen.findByRole("button", {
      name: /다른 영화/i,
    });
    await user.click(repickBtn);
    expect(screen.getByText(/오늘의 추천 영화/i)).toBeInTheDocument();
  });
});
