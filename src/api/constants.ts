// scripts/*.ts는 tsx(Node)로 실행돼 import.meta.env가 없어서 process.env로 대체한다
export const DATA_GO_KR_API_KEY =
  import.meta.env?.VITE_DATA_GO_KR_KEY ?? process.env.DATA_GO_KR_KEY;
export const SEOUL_API_KEY =
  import.meta.env?.VITE_SEOUL_API_KEY ?? process.env.SEOUL_API_KEY;

export const WEATHER_API_ENDPOINT =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export const AIR_API_ENDPOINT =
  "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

// http만 지원 (https 배포 시 막힘)
export const SUBWAY_API_ENDPOINT = "http://swopenapi.seoul.go.kr/api/subway";

// 지하철역 전체 목록(마스터) 조회용. 실시간 도착정보와 도메인이 다르다.
export const STATION_MASTER_ENDPOINT = "http://openapi.seoul.go.kr:8088";
