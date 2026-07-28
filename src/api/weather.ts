import { DATA_GO_KR_API_KEY, WEATHER_API_ENDPOINT } from "./constants";
import { ApiError } from "./ApiError";

// 광진구 좌표를 기상청 격자(X, Y)로 변환한 값
const GRID = { nx: 62, ny: 126 };

const SUCCESS_CODE = "00";
const UMBRELLA_POP_THRESHOLD = 50;

const DAY_MS = 24 * 60 * 60 * 1000;
// 오늘의 TMN(최저기온)은 어제 2300 회차와 오늘 0200 회차에만 실린다.
// 그중 하루 종일 쓸 수 있는 어제 2300 회차로 고정한다.
const BASE_TIME = "2300";

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

// 기상청은 KST 기준이라 실행 환경 타임존(Actions 러너는 UTC)과 무관하게 서울 날짜를 읽는다.
// sv-SE 로케일이 YYYY-MM-DD로 포맷해줘서 하이픈만 빼면 기상청 형식이 된다.
function seoulDate(d: Date): string {
  return d
    .toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
    .replaceAll("-", "");
}

export async function getWeather(): Promise<WeatherSummary> {
  const now = new Date();
  const params = new URLSearchParams({
    serviceKey: DATA_GO_KR_API_KEY,
    dataType: "JSON",
    numOfRows: "1000",
    pageNo: "1",
    base_date: seoulDate(new Date(now.getTime() - DAY_MS)),
    base_time: BASE_TIME,
    nx: String(GRID.nx),
    ny: String(GRID.ny),
  });

  const res = await fetch(`${WEATHER_API_ENDPOINT}?${params}`);
  if (!res.ok)
    throw new ApiError(
      `날씨 조회 실패 (HTTP ${res.status})`,
      `HTTP_${res.status}`,
    );
  const json = await res.json();
  const resultCode = json.response?.header?.resultCode;
  if (resultCode !== SUCCESS_CODE) {
    throw new ApiError(
      `날씨 조회 실패: ${json.response?.header?.resultMsg ?? "알 수 없음"}`,
      resultCode ?? "UNKNOWN",
    );
  }

  const forecastItems: ForecastItem[] = json.response.body.items.item;
  const today = seoulDate(now);
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
