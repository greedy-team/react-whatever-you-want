// 서울시 역명 마스터 API에는 없고 실시간 도착 API 조회 시엔 필요한 부역명 병기 전체명
// (realtimeStationArrival은 부역명이 있는 역은 반드시 전체명으로만 조회됨)
export const STATION_FULL_NAME: Record<string, string> = {
  아차산: "아차산(어린이대공원후문)",
  천호: "천호(풍납토성)",
  군자: "군자(능동)",
  몽촌토성: "몽촌토성(평화의문)",
  굽은다리: "굽은다리(강동구민회관앞)",
};

export const STATION_NAME_OPTIONS = Object.values(STATION_FULL_NAME);
