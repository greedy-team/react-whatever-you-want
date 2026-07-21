import { useEffect } from "react";
import { getWeather, type WeatherSummary } from "../api/weather";
import { getAir, AIR_GRADE_LABEL, type AirSummary } from "../api/air";
import { getArrivals, type Arrival } from "../api/subway";
import { getFavorite } from "../lib/favorites";
import { useResource } from "../lib/useResource";

// 불러온 데이터를 컴포넌트 밖에 저장한다.
// 페이지를 왕복해도 이 값이 남아서 다시 안 부른다. 새로고침 버튼으로만 갱신.
const cache: {
  weather: WeatherSummary | null;
  air: AirSummary | null;
  arrivals: Arrival[] | null;
  station: string | null; // arrivals를 불러온 역
} = { weather: null, air: null, arrivals: null, station: null };

// 날씨·미세먼지·지하철을 한 화면에
function Briefing() {
  const fav = getFavorite();

  const weather = useResource(cache.weather);
  const air = useResource(cache.air);
  const arrivals = useResource(
    cache.station === fav.departure ? cache.arrivals : null,
  );

  // 3개를 모두 다시 불러오고 캐시에 저장한다 (처음 한 번 + 새로고침 버튼)
  function load() {
    weather.start();
    weather.load(getWeather(), (w) => {
      cache.weather = w;
    });

    air.start();
    air.load(getAir(), (a) => {
      cache.air = a;
    });

    arrivals.start();
    arrivals.load(getArrivals(fav.departure), (list) => {
      cache.arrivals = list;
      cache.station = fav.departure;
    });
  }

  useEffect(() => {
    // 캐시가 비었거나 출발역이 바뀌었을 때만 부른다. 단순 왕복이면 캐시 그대로.
    if (
      cache.weather === null ||
      cache.air === null ||
      cache.arrivals === null ||
      cache.station !== fav.departure
    ) {
      load();
    }
  }, [fav.departure]);

  return (
    <section>
      <h2 aria-label="오늘의 브리핑">
        오늘의 브리핑{" "}
        <button type="button" className="refresh" onClick={load}>
          새로고침
        </button>
      </h2>

      <article>
        <h3>☔ 날씨</h3>
        {weather.error && <p role="alert">{weather.error}</p>}
        {!weather.data && !weather.error && <p>불러오는 중…</p>}
        {weather.data && (
          <p>
            {weather.data.minTemp}℃ ~ {weather.data.maxTemp}℃ · 강수확률{" "}
            {weather.data.pop}%
            {weather.data.needUmbrella && " → 우산 챙기세요!"}
          </p>
        )}
      </article>

      <article>
        <h3>😷 미세먼지</h3>
        {air.error && <p role="alert">{air.error}</p>}
        {!air.data && !air.error && <p>불러오는 중…</p>}
        {air.data && (
          <p>
            PM2.5 = {air.data.pm25}㎍/㎥ ({AIR_GRADE_LABEL[air.data.pm25Grade]})
            <br />
            PM10 = {air.data.pm10}㎍/㎥ ({AIR_GRADE_LABEL[air.data.pm10Grade]})
            {air.data.needMask && " → 마스크 권장"}
          </p>
        )}
      </article>

      <article>
        <h3>🚇 {fav.departure}역 도착 정보</h3>
        {arrivals.error && <p role="alert">{arrivals.error}</p>}
        {!arrivals.data && !arrivals.error && <p>불러오는 중…</p>}
        {arrivals.data && arrivals.data.length === 0 && (
          <p>도착 예정 열차가 없습니다.</p>
        )}
        {arrivals.data && arrivals.data.length > 0 && (
          <ul>
            {arrivals.data.slice(0, 6).map((a) => (
              // 완전히 고유한 ID는 API에 없어서, index보다 안정적인 조합을 key로 사용
              // (참고: https://ko.legacy.reactjs.org/docs/lists-and-keys.html)
              <li key={`${a.lineId}-${a.direction}-${a.destination}`}>
                [{a.direction}] {a.destination} — {a.message}
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

export default Briefing;
