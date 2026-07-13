import { DATA_GO_KR_API_KEY, WEATHER_API_ENDPOINT } from "./constants";

// 광진구 좌표
const GRID = { nx: 62, ny: 126 };

// 정상 응답 코드
const SUCCESS_CODE = "00";
// 강수확률 이 값 이상이면 우산
const UMBRELLA_POP = 50;

export interface WeatherSummary {
  minTemp: string; // 최저기온 (℃)
  maxTemp: string; // 최고기온 (℃)
  pop: number; // 강수확률 최대치 (%)
  rain: boolean; // 오늘 비/눈 예보 여부
  needUmbrella: boolean; // 우산 필요 여부
}

interface FcstItem {
  category: string;
  fcstDate: string;
  fcstValue: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

// 지금 기준 가장 최근 발표 시각
function latestBase(now: Date): { base_date: string; base_time: string } {
  const slots = [2300, 2000, 1700, 1400, 1100, 800, 500, 200];
  const hm = now.getHours() * 100 + now.getMinutes();
  for (const t of slots) {
    if (hm >= t + 10)
      return { base_date: fmtDate(now), base_time: pad((t / 100) | 0) + "00" };
  }
  const prev = new Date(now);
  prev.setDate(prev.getDate() - 1);
  return { base_date: fmtDate(prev), base_time: "2300" };
}

export async function getWeather(): Promise<WeatherSummary> {
  const now = new Date();
  const { base_date, base_time } = latestBase(now);
  const params = new URLSearchParams({
    serviceKey: DATA_GO_KR_API_KEY,
    dataType: "JSON",
    numOfRows: "1000",
    pageNo: "1",
    base_date,
    base_time,
    nx: String(GRID.nx),
    ny: String(GRID.ny),
  });

  const res = await fetch(`${WEATHER_API_ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`날씨 조회 실패 (HTTP ${res.status})`);
  const json = await res.json();
  if (json.response?.header?.resultCode !== SUCCESS_CODE) {
    throw new Error(
      `날씨 조회 실패: ${json.response?.header?.resultMsg ?? "알 수 없음"}`,
    );
  }

  const items: FcstItem[] = json.response.body.items.item;
  const today = fmtDate(now);
  const todays = items.filter((i) => i.fcstDate === today);
  const values = (cat: string) =>
    todays.filter((i) => i.category === cat).map((i) => i.fcstValue);

  const pops = values("POP").map(Number);
  const ptys = values("PTY").filter((v) => v !== "0");

  return {
    minTemp: values("TMN")[0] ?? "-",
    maxTemp: values("TMX")[0] ?? "-",
    pop: pops.length ? Math.max(...pops) : 0,
    rain: ptys.length > 0,
    needUmbrella: pops.length ? Math.max(...pops) >= UMBRELLA_POP : false,
  };
}
