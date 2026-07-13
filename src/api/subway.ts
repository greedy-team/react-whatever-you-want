import { SEOUL_API_KEY, SUBWAY_API_ENDPOINT } from "./constants";

// 정상 응답 코드
const SUCCESS_CODE = "INFO-000";

export interface Arrival {
  line: string; // 호선 (subwayId)
  direction: string; // 상행/하행/내선/외선
  dest: string; // "성수행 - 역삼방면"
  message: string; // "전역 출발" 등 도착 안내
  seconds: number; // 도착까지 남은 초 (0이면 진입/도착)
}

interface RawArrival {
  subwayId: string;
  updnLine: string;
  trainLineNm: string;
  arvlMsg2: string;
  barvlDt: string;
}

// 지정 역의 실시간 도착 정보
export async function getArrivals(station: string): Promise<Arrival[]> {
  const url = `${SUBWAY_API_ENDPOINT}/${SEOUL_API_KEY}/json/realtimeStationArrival/0/10/${encodeURIComponent(station)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`지하철 조회 실패 (HTTP ${res.status})`);
  const json = await res.json();

  // 성공해도 키 이름이 errorMessage라 code로 판별
  const code = json.errorMessage?.code;
  if (code && code !== SUCCESS_CODE) {
    throw new Error(`지하철 조회 실패: ${json.errorMessage?.message ?? code}`);
  }

  const list: RawArrival[] = json.realtimeArrivalList ?? [];
  return list.map((r) => ({
    line: r.subwayId,
    direction: r.updnLine,
    dest: r.trainLineNm,
    message: r.arvlMsg2,
    seconds: Number(r.barvlDt),
  }));
}
