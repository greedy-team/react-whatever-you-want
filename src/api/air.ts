import { DATA_GO_KR_API_KEY, AIR_API_ENDPOINT } from "./constants";
import { ApiError } from "./ApiError";

const AIR_STATION_NAME = "광진구";

const SUCCESS_CODE = "00";
const MASK_GRADE_THRESHOLD = 3; // 나쁨(3) 이상이면 마스크 필요로 판단

export interface AirSummary {
  pm10: string; // 미세먼지 농도 (㎍/㎥)
  pm25: string; // 초미세먼지 농도 (㎍/㎥)
  pm10Grade: number; // 1 좋음 ~ 4 매우나쁨
  pm25Grade: number;
  time: string; // 측정 시각
  needMask: boolean; // 나쁨 이상이면 true
}

// 에어코리아 응답의 개별 측정소 항목. Value는 농도, Grade는 그 농도에 대한 등급으로 서로 다른 값이다.
interface AirQualityItem {
  pm10Value: string | null;
  pm25Value: string | null;
  pm10Grade: string | null;
  pm25Grade: string | null;
  dataTime: string;
}

function parseGrade(grade: string | null): number {
  return Number(grade) || 0;
}

export async function getAir(): Promise<AirSummary> {
  const params = new URLSearchParams({
    serviceKey: DATA_GO_KR_API_KEY,
    returnType: "json",
    numOfRows: "1",
    pageNo: "1",
    stationName: AIR_STATION_NAME,
    dataTerm: "DAILY",
    ver: "1.3",
  });

  const res = await fetch(`${AIR_API_ENDPOINT}?${params}`);
  if (!res.ok)
    throw new ApiError(`대기질 조회 실패 (HTTP ${res.status})`, `HTTP_${res.status}`);
  const json = await res.json();
  const resultCode = json.response?.header?.resultCode;
  if (resultCode !== SUCCESS_CODE) {
    throw new ApiError(
      `대기질 조회 실패: ${json.response?.header?.resultMsg ?? "알 수 없음"}`,
      resultCode ?? "UNKNOWN",
    );
  }

  const item: AirQualityItem | undefined = json.response.body.items[0];
  if (!item) throw new ApiError("대기질 측정값이 없습니다", "NO_DATA");

  const pm10Grade = parseGrade(item.pm10Grade);
  const pm25Grade = parseGrade(item.pm25Grade);
  return {
    pm10: item.pm10Value ?? "-",
    pm25: item.pm25Value ?? "-",
    pm10Grade,
    pm25Grade,
    time: item.dataTime,
    needMask: pm10Grade >= MASK_GRADE_THRESHOLD || pm25Grade >= MASK_GRADE_THRESHOLD,
  };
}

export const AIR_GRADE_LABEL: Record<number, string> = {
  0: "정보없음",
  1: "좋음",
  2: "보통",
  3: "나쁨",
  4: "매우나쁨",
};
