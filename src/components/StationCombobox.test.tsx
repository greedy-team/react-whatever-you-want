import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import StationCombobox from "./StationCombobox";

// 지하철역 API 목 데이터 생성
vi.mock("../api/subwayStations", () => ({
  getStationNames: vi.fn().mockResolvedValue(["아차산(어린이대공원후문)", "강남"]),
}));

function renderStationCombobox() {
  const onChange = vi.fn();

  function TestStationCombobox() {
    const [value, setValue] = useState("");

    return (
      <StationCombobox
        id="station"
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          onChange(nextValue);
        }}
      />
    );
  }

  render(<TestStationCombobox />);
  // 사용자 입력 도구와 onChange 호출 기록을 반환
  return { user: userEvent.setup(), onChange };
}

describe("StationCombobox", () => {
  it("역 이름을 입력하면 필터링된 목록을 보여준다", async () => {
    const { user } = renderStationCombobox();

    // "아차" 입력 시 "아차산(어린이대공원후문)"만 표시되는지 확인
    await user.type(screen.getByRole("combobox"), "아차");

    expect(
      await screen.findByRole("option", { name: "아차산(어린이대공원후문)" }),
    ).toBeDefined();
    expect(screen.queryByRole("option", { name: "강남" })).toBeNull();
  });

  it("목록에서 역을 선택하면 역 이름을 전달한다", async () => {
    const { user, onChange } = renderStationCombobox();
    await user.type(screen.getByRole("combobox"), "아차");

    // "아차산(어린이대공원후문)"을 눌렀을 때 역 이름이 전달되는지 확인
    await user.click(
      await screen.findByRole("option", { name: "아차산(어린이대공원후문)" }),
    );

    expect(onChange).toHaveBeenLastCalledWith("아차산(어린이대공원후문)");
  });
});
