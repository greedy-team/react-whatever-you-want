import { SEOUL_API_KEY, STATION_MASTER_ENDPOINT } from "./constants";

const SUCCESS_CODE = "INFO-000";
const STATION_MASTER_SERVICE = "subwayStationMaster";
const MAX_FETCH_COUNT = 1000; // 전체 역 수(784개)를 한 번에 담을 수 있는 넉넉한 값

interface StationMasterItem {
  BLDN_NM: string; // 역명 (부역명 포함 전체명, 예: "아차산(어린이대공원후문)")
}

let cachedNames: Promise<string[]> | null = null;

// 서울 지하철 전체 역명(784개)을 가져온다. 앱 실행 중 처음 한 번만 실제로 조회한다.
export function getStationNames(): Promise<string[]> {
  cachedNames ??= fetchStationNames();
  return cachedNames;
}

async function fetchStationNames(): Promise<string[]> {
  const url = `${STATION_MASTER_ENDPOINT}/${SEOUL_API_KEY}/json/${STATION_MASTER_SERVICE}/1/${MAX_FETCH_COUNT}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`지하철역 목록 조회 실패 (HTTP ${res.status})`);
  const json = await res.json();
  if (json.subwayStationMaster?.RESULT?.CODE !== SUCCESS_CODE) {
    throw new Error(
      `지하철역 목록 조회 실패: ${json.subwayStationMaster?.RESULT?.MESSAGE ?? "알 수 없음"}`,
    );
  }

  const items: StationMasterItem[] = json.subwayStationMaster.row ?? [];
  const uniqueNames = [...new Set(items.map((item) => item.BLDN_NM))];
  return uniqueNames.sort((a, b) => a.localeCompare(b, "ko"));
}
