import { getWeather } from "../src/api/weather";
import { getAir, AIR_GRADE_LABEL } from "../src/api/air";
import { getArrivals } from "../src/api/subway";
import { getFavorite } from "../src/lib/favorites";

const {
  KAKAO_REST_API_KEY,
  KAKAO_CLIENT_SECRET,
  KAKAO_REFRESH_TOKEN,
  STATION = getFavorite().departure,
} = process.env;

// 실패해도 나머지는 정상 발송 (섹션별 폴백)
async function section(label: string, fn: () => Promise<string>) {
  try {
    return `${label} ${await fn()}`;
  } catch {
    return `${label} 조회 실패`;
  }
}

async function getWeatherText() {
  const w = await getWeather();
  return `${w.minTemp}~${w.maxTemp}℃ 강수${w.pop}%${w.needUmbrella ? " ☔" : ""}`;
}

async function getAirText() {
  const a = await getAir();
  return `PM2.5 ${AIR_GRADE_LABEL[a.pm25Grade]} · PM10 ${AIR_GRADE_LABEL[a.pm10Grade]}${a.needMask ? " 😷" : ""}`;
}

async function getSubwayText() {
  const list = await getArrivals(STATION);
  if (list.length === 0) return "도착 예정 열차가 없습니다.";
  const a = list[0];
  return `[${a.direction}] ${a.message}`;
}

async function refreshAccessToken() {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: KAKAO_REST_API_KEY!,
    client_secret: KAKAO_CLIENT_SECRET!,
    refresh_token: KAKAO_REFRESH_TOKEN!,
  });

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`카카오 토큰 갱신 실패: ${JSON.stringify(json)}`);
  return json.access_token as string;
}

async function sendKakaoMessage(accessToken: string, text: string) {
  const templateObject = {
    object_type: "text",
    text,
    link: {
      web_url: "https://developers.kakao.com",
      mobile_web_url: "https://developers.kakao.com",
    },
  };

  const res = await fetch(
    "https://kapi.kakao.com/v2/api/talk/memo/default/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        template_object: JSON.stringify(templateObject),
      }),
    },
  );

  const json = await res.json();
  if (!res.ok) throw new Error(`메시지 전송 실패: ${JSON.stringify(json)}`);
  return json;
}

const [weather, air, subway] = await Promise.all([
  section("☔", getWeatherText),
  section("😷", getAirText),
  section(`🚇${STATION}`, getSubwayText),
]);

// text 템플릿은 200자 제한이라 넘으면 잘라낸다
const text = `${weather}\n${air}\n${subway}`.slice(0, 200);

const accessToken = await refreshAccessToken();
const result = await sendKakaoMessage(accessToken, text);
console.log("전송 완료:", result);
