import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchScreen } from "./SearchScreen";
import { fetchMissingPersons } from "../../api/missingPersons";
import {
  mockMalePersons,
  mockMissingPersons,
} from "../../test/missingPersons.dummy";

vi.mock("../../api/missingPersons", () => ({
  fetchMissingPersons: vi.fn(),
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("SearchScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("api호출", () => {
    it("검색 전에는 API가 호출되지 않는다", () => {
      renderWithQueryClient(<SearchScreen />);
      expect(fetchMissingPersons).not.toHaveBeenCalled();
    });

    it("성별을 선택하고 찾아보기를 누르면 해당 조건으로 API를 호출한다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockResolvedValue({
        list: mockMalePersons,
        lastTriedPage: 1,
        exhausted: true,
      });

      renderWithQueryClient(<SearchScreen />);

      await user.selectOptions(screen.getByLabelText("성별"), "1");
      await user.click(screen.getByRole("button", { name: "찾아보기" }));

      expect(fetchMissingPersons).toHaveBeenCalledWith({
        rowSize: 10,
        page: 1,
        gender: "1",
        age: "none",
      });
    });
  });

  describe("화면에 결과 출력", () => {
    it("검색하면 첫 번째 결과가 화면에 뜬다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockResolvedValue({
        list: mockMalePersons,
        lastTriedPage: 1,
        exhausted: true,
      });

      renderWithQueryClient(<SearchScreen />);
      await user.click(screen.getByRole("button", { name: "찾아보기" }));

      expect(
        await screen.findByText(mockMalePersons[0].nm),
      ).toBeInTheDocument();
    });
    it("결과가 없으면 더 이상 결과가 없습니다를 보여준다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockResolvedValue({
        list: [],
        lastTriedPage: 1,
        exhausted: true,
      });

      renderWithQueryClient(<SearchScreen />);
      await user.click(screen.getByRole("button", { name: "찾아보기" }));

      expect(
        await screen.findByText("더 이상 결과가 없습니다."),
      ).toBeInTheDocument();
    });
  });

  describe("다음, 이전버튼 작동", () => {
    it("다음 버튼을 누르면 다음 사람이 뜨고, 첫 결과에서는 이전 버튼이 비활성화된다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockResolvedValue({
        list: mockMalePersons,
        lastTriedPage: 1,
        exhausted: true,
      });

      renderWithQueryClient(<SearchScreen />);
      await user.click(screen.getByRole("button", { name: "찾아보기" }));
      await screen.findByText(mockMalePersons[0].nm);

      // 첫 결과: 이전 버튼 비활성화
      expect(screen.getByRole("button", { name: "▲ 이전" })).toBeDisabled();

      // 다음 클릭 → 두 번째 사람으로 이동
      await user.click(screen.getByRole("button", { name: "▼ 다음" }));
      expect(
        await screen.findByText(mockMalePersons[1].nm),
      ).toBeInTheDocument();
    });

    it("이전 버튼을 누르면 이전 사람이 뜬다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockResolvedValue({
        list: mockMalePersons,
        lastTriedPage: 1,
        exhausted: true,
      });
      renderWithQueryClient(<SearchScreen />);

      await user.click(screen.getByRole("button", { name: "찾아보기" }));
      await screen.findByText(mockMalePersons[0].nm);
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole("button", { name: "▼ 다음" }));
      }
      expect(
        await screen.findByText(mockMalePersons[5].nm),
      ).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "▲ 이전" }));
      expect(
        await screen.findByText(mockMalePersons[4].nm),
      ).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "▲ 이전" }));
      expect(
        await screen.findByText(mockMalePersons[3].nm),
      ).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "▲ 이전" }));
      expect(
        await screen.findByText(mockMalePersons[2].nm),
      ).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "▲ 이전" }));
      expect(
        await screen.findByText(mockMalePersons[1].nm),
      ).toBeInTheDocument();
    });
    it("페이지 경계를 넘어 이전으로 가면 이전 페이지의 마지막 사람이 뜬다", async () => {
      const user = userEvent.setup();

      vi.mocked(fetchMissingPersons).mockImplementation(({ page }) => {
        if (page === 1) {
          return Promise.resolve({
            list: mockMissingPersons.slice(0, 10), // 1~10번째
            lastTriedPage: 1,
            exhausted: false,
          });
        }
        if (page === 2) {
          return Promise.resolve({
            list: mockMissingPersons.slice(10, 20),
            lastTriedPage: 2,
            exhausted: true,
          });
        }
        throw new Error("예상하지 못한 페이지 호출: " + page);
      });

      renderWithQueryClient(<SearchScreen />);
      await user.click(screen.getByRole("button", { name: "찾아보기" }));
      await screen.findByText(mockMissingPersons[0].nm);

      for (let i = 0; i < 9; i++) {
        await user.click(screen.getByRole("button", { name: "▼ 다음" }));
      }
      expect(
        await screen.findByText(mockMissingPersons[9].nm),
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "▼ 다음" }));
      expect(
        await screen.findByText(mockMissingPersons[10].nm),
      ).toBeInTheDocument();

      // 이전 클릭 → 1페이지 "마지막(10번째)" 사람으로 가야 함 (버그였던 지점)
      await user.click(screen.getByRole("button", { name: "▲ 이전" }));
      expect(
        await screen.findByText(mockMissingPersons[9].nm),
      ).toBeInTheDocument();
    });
  });

  describe("에러 메시지", () => {
    it("API 호출이 실패하면 에러 메시지를 보여준다", async () => {
      const user = userEvent.setup();
      vi.mocked(fetchMissingPersons).mockRejectedValue(
        new Error("서버 오류가 발생했습니다"),
      );

      renderWithQueryClient(<SearchScreen />);
      await user.click(screen.getByRole("button", { name: "찾아보기" }));

      expect(await screen.findByText(/에러:/)).toBeInTheDocument();
    });
  });
});
