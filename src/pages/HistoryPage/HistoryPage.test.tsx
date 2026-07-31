import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import HistoryPage from "./HistoryPage";

const mockMovies = [{ id: 101, title: "기생충", genre: "drama", era: "2010s" }];

describe("HistoryPage - 보관함 기능 테스트", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("보관함이 비어있을 때 빈 안내 문구를 출력한다", () => {
    Storage.prototype.getItem = vi.fn(() => JSON.stringify([]));

    render(<HistoryPage />);
    expect(
      screen.getByText(/아직 보관함에 담긴 영화가 없습니다/i),
    ).toBeInTheDocument();
  });

  it("저장된 영화가 있을 경우 영화 목록을 표시한다", () => {
    Storage.prototype.getItem = vi.fn(() => JSON.stringify(mockMovies));

    render(<HistoryPage />);
    expect(screen.getByText("기생충")).toBeInTheDocument();
  });

  it("지우기 버튼을 누르면 localStorage에서 영화가 삭제된다", async () => {
    const user = userEvent.setup();
    Storage.prototype.getItem = vi.fn(() => JSON.stringify(mockMovies));
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(<HistoryPage />);
    const deleteButton = screen.getByRole("button", { name: /지우기/i });
    await user.click(deleteButton);

    expect(setItemSpy).toHaveBeenCalledWith("flixdrop_history", "[]");
  });
});
