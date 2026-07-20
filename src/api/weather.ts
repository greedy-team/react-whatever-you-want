import { DATA_GO_KR_API_KEY, WEATHER_API_ENDPOINT } from "./constants";

// 광진구 좌표를 기상청 격자(X, Y)로 변환한 값
const GRID = { nx: 62, ny: 126 };

const SUCCESS_CODE = "00";
const UMBRELLA_POP_THRESHOLD = 50;

// 기상청 단기예보 발표 시각 (하루 8회, 3시간 간격) — 최신 순
const PUBLISH_HOURS = [23, 20, 17, 14, 11, 8, 5, 2];
// 발표 후 API에 실제로 반영되기까지의 지연 시간 (분)
const PUBLISH_DELAY_MINUTES = 10;

export interface WeatherSummary {
  minTemp: string; // 최저기온 (℃)
  maxTemp: string; // 최고기온 (℃)
  pop: number; // 강수확률 최대치 (%)
  rain: boolean; // 오늘 비/눈 예보 여부
  needUmbrella: boolean; // 우산 필요 여부
}

// 기상청 단기예보 응답의 개별 항목 (한 시각·한 항목당 한 줄로 옴)
interface ForecastItem {
  category: string; // 항목 코드 (TMN=최저기온, TMX=최고기온, POP=강수확률, PTY=강수형태)
  fcstDate: string; // 예보 날짜 (YYYYMMDD)
  fcstValue: string; // 예보 값
}

function padTwoDigits(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}${padTwoDigits(d.getMonth() + 1)}${padTwoDigits(d.getDate())}`;
}

// 기상청 API는 base_date/base_time으로 발표 회차를 지정해야 해서, 지금 기준 가장 최근 발표 시각을 구한다
function getLatestBaseTime(now: Date): { base_date: string; base_time: string } {
  const hm = now.getHours() * 100 + now.getMinutes();
  for (const hour of PUBLISH_HOURS) {
    if (hm >= hour * 100 + PUBLISH_DELAY_MINUTES)
      return {
        base_date: formatDate(now),
        base_time: padTwoDigits(hour) + "00",
      };
  }
  const prevDay = new Date(now);
  prevDay.setDate(prevDay.getDate() - 1);
  return {
    base_date: formatDate(prevDay),
    base_time: padTwoDigits(PUBLISH_HOURS[0]) + "00",
  };
}

export async function getWeather(): Promise<WeatherSummary> {
  const now = new Date();
  const { base_date, base_time } = getLatestBaseTime(now);
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

  const forecastItems: ForecastItem[] = json.response.body.items.item;
  const today = formatDate(now);
  const todaysForecastItems = forecastItems.filter(
    (item) => item.fcstDate === today,
  );
  const valuesByCategory = (category: string) =>
    todaysForecastItems
      .filter((item) => item.category === category)
      .map((item) => item.fcstValue);

  const precipitationProbabilities = valuesByCategory("POP").map(Number);
  const precipitationTypeCodes = valuesByCategory("PTY").filter(
    (v) => v !== "0",
  );
  const maxPrecipitationProbability = precipitationProbabilities.length
    ? Math.max(...precipitationProbabilities)
    : 0;

  return {
    minTemp: valuesByCategory("TMN")[0] ?? "-",
    maxTemp: valuesByCategory("TMX")[0] ?? "-",
    pop: maxPrecipitationProbability,
    rain: precipitationTypeCodes.length > 0,
    needUmbrella: maxPrecipitationProbability >= UMBRELLA_POP_THRESHOLD,
  };
}
