const KEY = import.meta.env.VITE_DATA_GO_KR_KEY;
const ENDPOINT =
  "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

const STATION = "광진구";

// 정상 응답 코드
const SUCCESS_CODE = "00";
// 이 등급 이상이면 마스크 (3=나쁨)
const MASK_GRADE = 3;

export interface AirSummary {
  pm10: string; // 미세먼지 농도
  pm25: string; // 초미세먼지 농도
  pm10Grade: number; // 1 좋음 ~ 4 매우나쁨
  pm25Grade: number;
  time: string; // 측정 시각
  needMask: boolean; // 나쁨 이상이면 true
}

interface AirItem {
  pm10Value: string | null;
  pm25Value: string | null;
  pm10Grade: string | null;
  pm25Grade: string | null;
  dataTime: string;
}

const grade = (g: string | null): number => Number(g) || 0;

export async function getAir(): Promise<AirSummary> {
  const params = new URLSearchParams({
    serviceKey: KEY,
    returnType: "json",
    numOfRows: "1",
    pageNo: "1",
    stationName: STATION,
    dataTerm: "DAILY",
    ver: "1.3",
  });

  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`대기질 조회 실패 (HTTP ${res.status})`);
  const json = await res.json();
  if (json.response?.header?.resultCode !== SUCCESS_CODE) {
    throw new Error(
      `대기질 조회 실패: ${json.response?.header?.resultMsg ?? "알 수 없음"}`,
    );
  }

  const item: AirItem | undefined = json.response.body.items[0];
  if (!item) throw new Error("대기질 측정값이 없습니다");

  const pm10Grade = grade(item.pm10Grade);
  const pm25Grade = grade(item.pm25Grade);
  return {
    pm10: item.pm10Value ?? "-",
    pm25: item.pm25Value ?? "-",
    pm10Grade,
    pm25Grade,
    time: item.dataTime,
    needMask: pm10Grade >= MASK_GRADE || pm25Grade >= MASK_GRADE,
  };
}

export const GRADE_LABEL: Record<number, string> = {
  0: "정보없음",
  1: "좋음",
  2: "보통",
  3: "나쁨",
  4: "매우나쁨",
};
