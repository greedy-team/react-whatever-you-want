// ListScreen.test.tsx
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListScreen } from "./ListScreen";
import { fetchMissingPersons } from "../../api/missingPersons";
import { mockMissingPersons } from "../../test/missingPersons.dummy";

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

describe("ListScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("실종자 목록이 정상적으로 뜬다", async () => {
    // Arrange: API가 이런 데이터를 반환한다고 가정
    vi.mocked(fetchMissingPersons).mockResolvedValue({
      list: mockMissingPersons.slice(0, 20),
      lastTriedPage: 1,
      exhausted: false,
    });

    // Act
    renderWithQueryClient(<ListScreen />);

    expect(screen.getByText("불러오는 중...")).toBeInTheDocument();

    expect(await screen.findByText("김민준")).toBeInTheDocument();
    expect(screen.getByText("김서연")).toBeInTheDocument();
  });

  it("API 호출이 실패하면 에러 메시지를 보여준다", async () => {
    vi.mocked(fetchMissingPersons).mockRejectedValue(
      new Error("서버 오류가 발생했습니다"),
    );

    renderWithQueryClient(<ListScreen />);

    expect(await screen.findByText(/에러:/)).toBeInTheDocument();
  });
});
