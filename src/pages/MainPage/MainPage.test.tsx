import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import MainPage from "./MainPage";

describe("MainPage - 영화 필터 선택 테스트", () => {
  it("장르 선택 및 시대 선택 시 해당 옵션이 올바르게 반영된다", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>,
    );

    // 장르 라디오 선택
    const actionRadio = screen.getByRole("radio", { name: "액션" });
    await user.click(actionRadio);
    expect(actionRadio).toBeChecked();

    // 시대 셀렉트 선택
    const eraSelect = screen.getByRole("combobox");
    await user.selectOptions(eraSelect, "2020s");
    expect(eraSelect).toHaveValue("2020s");
  });
});
