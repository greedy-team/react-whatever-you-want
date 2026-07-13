export const DATA_GO_KR_API_KEY = import.meta.env.VITE_DATA_GO_KR_KEY;
export const SEOUL_API_KEY = import.meta.env.VITE_SEOUL_API_KEY;

export const WEATHER_API_ENDPOINT =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export const AIR_API_ENDPOINT =
  "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty";

// http만 지원 (https 배포 시 막힘)
export const SUBWAY_API_ENDPOINT = "http://swopenapi.seoul.go.kr/api/subway";
