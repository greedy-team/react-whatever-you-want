import { SEOUL_API_KEY, SUBWAY_API_ENDPOINT } from "./constants";

const SUCCESS_CODE = "INFO-000";

export interface Arrival {
  lineId: string; // 호선 코드 (subwayId)
  direction: string; // 상행/하행/내선/외선
  destination: string; // "성수행 - 역삼방면"
  message: string; // "전역 출발" 등 도착 안내
  seconds: number; // 도착까지 남은 초 (0이면 진입/도착)
}

interface SubwayArrivalItem {
  subwayId: string;
  updnLine: string;
  trainLineNm: string;
  arvlMsg2: string;
  barvlDt: string;
}

export async function getArrivals(station: string): Promise<Arrival[]> {
  const url = `${SUBWAY_API_ENDPOINT}/${SEOUL_API_KEY}/json/realtimeStationArrival/0/10/${encodeURIComponent(station)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`지하철 조회 실패 (HTTP ${res.status})`);
  const json = await res.json();

  // 성공해도 최상위 키 이름이 errorMessage라 안의 code로 판별해야 한다
  const code = json.errorMessage?.code;
  if (code && code !== SUCCESS_CODE) {
    throw new Error(`지하철 조회 실패: ${json.errorMessage?.message ?? code}`);
  }

  const arrivalItems: SubwayArrivalItem[] = json.realtimeArrivalList ?? [];
  return arrivalItems.map((item) => ({
    lineId: item.subwayId,
    direction: item.updnLine,
    destination: item.trainLineNm,
    message: item.arvlMsg2,
    seconds: Number(item.barvlDt),
  }));
}
