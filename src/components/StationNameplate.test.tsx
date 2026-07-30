import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StationNameplate from "./StationNameplate.tsx";
import type { Station } from "../types/station.ts";

const station: Station = {
  id: "0331",
  name: "교대",
  nameEng: "Gyodae",
  nameChn: "校大",
  nameJpn: "キョデ",
  line: "3호선",
};

describe("역명판", () => {
  it("한글 역명과 다국어 역명을 함께 보여준다", () => {
    render(<StationNameplate station={station} />);

    expect(screen.getByText("교대")).toBeInTheDocument();
    expect(screen.getByText("Gyodae")).toBeInTheDocument();
    expect(screen.getByText("校大")).toBeInTheDocument();
    expect(screen.getByText("キョデ")).toBeInTheDocument();
  });

  it("숫자 호선 배지는 눈에는 숫자만 보이지만 스크린리더는 호선까지 읽는다", () => {
    const { container } = render(<StationNameplate station={station} />);
    const badge = container.querySelector(".nameplate-badge");

    expect(badge).toHaveTextContent("3호선");
    expect(badge?.firstChild).toHaveTextContent("3");
    expect(badge?.querySelector(".sr-only")).toHaveTextContent("호선");
  });

  it("이름으로 된 노선은 배지에 이름을 그대로 쓰고 접미사를 붙이지 않는다", () => {
    const { container } = render(
      <StationNameplate station={{ ...station, line: "수인분당선" }} />,
    );
    const badge = container.querySelector(".nameplate-badge");

    expect(badge).toHaveTextContent("수인분당선");
    expect(badge?.querySelector(".sr-only")).toBeNull();
  });

  it("다국어 역명에 언어를 명시해 올바른 발음으로 읽히게 한다", () => {
    render(<StationNameplate station={station} />);

    expect(screen.getByText("Gyodae")).toHaveAttribute("lang", "en");
    expect(screen.getByText("校大")).toHaveAttribute("lang", "zh");
    expect(screen.getByText("キョデ")).toHaveAttribute("lang", "ja");
  });

  it("장식용 요소는 스크린리더가 읽지 않도록 숨긴다", () => {
    const { container } = render(<StationNameplate station={station} />);

    expect(container.querySelector(".nameplate-bar")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    container.querySelectorAll(".sep").forEach((sep) => {
      expect(sep).toHaveAttribute("aria-hidden", "true");
    });
  });
});
