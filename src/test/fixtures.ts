import { vi } from "vitest";

export interface RawRow {
  STATION_CD: string;
  STATION_NM: string;
  STATION_NM_ENG: string;
  STATION_NM_CHN: string;
  STATION_NM_JPN: string;
  LINE_NUM: string;
}

export function row(
  code: string,
  name: string,
  line: string,
  eng = `${name}-eng`,
): RawRow {
  return {
    STATION_CD: code,
    STATION_NM: name,
    STATION_NM_ENG: eng,
    STATION_NM_CHN: `${name}-chn`,
    STATION_NM_JPN: `${name}-jpn`,
    LINE_NUM: line,
  };
}

export const ROWS: RawRow[] = [
  row("0331", "교대", "03호선"),
  row("0332", "남부터미널", "03호선"),
  row("0333", "양재", "03호선"),
  row("0222", "강남", "02호선"),
  row("0223", "역삼", "02호선"),
  row("4301", "죽전", "수인분당선"),
];

export function okResponse(rows: RawRow[] = ROWS) {
  return {
    SearchSTNBySubwayLineInfo: {
      list_total_count: rows.length,
      RESULT: { CODE: "INFO-000", MESSAGE: "정상 처리되었습니다." },
      row: rows,
    },
  };
}

export function mockFetchSuccess(rows: RawRow[] = ROWS) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => okResponse(rows),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function mockFetchNetworkError(status = 500) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({}),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
