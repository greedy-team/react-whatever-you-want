// 1회성: 인가 코드(code)를 access_token/refresh_token으로 교환한다.
// 실행: node --env-file=.env scripts/kakao-token.js <code>
const code = process.argv[2];
if (!code) {
  console.error("사용법: node --env-file=.env scripts/kakao-token.js <code>");
  process.exit(1);
}

const { KAKAO_REST_API_KEY, KAKAO_CLIENT_SECRET, KAKAO_REDIRECT_URI } =
  process.env;

const params = new URLSearchParams({
  grant_type: "authorization_code",
  client_id: KAKAO_REST_API_KEY,
  client_secret: KAKAO_CLIENT_SECRET,
  redirect_uri: KAKAO_REDIRECT_URI,
  code,
});

const res = await fetch("https://kauth.kakao.com/oauth/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: params,
});

const json = await res.json();
if (!res.ok) {
  console.error("토큰 발급 실패:", json);
  process.exit(1);
}

console.log("access_token:", json.access_token);
console.log("refresh_token:", json.refresh_token);
console.log("\nrefresh_token을 GitHub Secrets(KAKAO_REFRESH_TOKEN)에 저장하세요.");
