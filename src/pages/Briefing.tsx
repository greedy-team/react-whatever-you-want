import { useEffect, useState } from "react";
import { getWeather, type WeatherSummary } from "../api/weather";
import { getAir, GRADE_LABEL, type AirSummary } from "../api/air";
import { getArrivals, type Arrival } from "../api/subway";
import { getFavorite } from "../lib/favorites";

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

  const [weather, setWeather] = useState(cache.weather);
  const [weatherError, setWeatherError] = useState(false);

  const [air, setAir] = useState(cache.air);
  const [airError, setAirError] = useState(false);

  const [arrivals, setArrivals] = useState(
    cache.station === fav.departure ? cache.arrivals : null,
  );
  const [arrivalsError, setArrivalsError] = useState(false);

  // 3개를 모두 다시 불러오고 캐시에 저장한다 (처음 한 번 + 새로고침 버튼)
  function load() {
    setWeather(null);
    setWeatherError(false);
    getWeather()
      .then((w) => {
        cache.weather = w;
        setWeather(w);
      })
      .catch(() => setWeatherError(true));

    setAir(null);
    setAirError(false);
    getAir()
      .then((a) => {
        cache.air = a;
        setAir(a);
      })
      .catch(() => setAirError(true));

    setArrivals(null);
    setArrivalsError(false);
    getArrivals(fav.departure)
      .then((list) => {
        cache.arrivals = list;
        cache.station = fav.departure;
        setArrivals(list);
      })
      .catch(() => setArrivalsError(true));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fav.departure]);

  return (
    <section>
      <h2>
        오늘의 브리핑{" "}
        <button type="button" className="refresh" onClick={load}>
          새로고침
        </button>
      </h2>

      <article>
        <h3>☔ 날씨</h3>
        {weatherError && <p role="alert">날씨 정보를 불러오지 못했습니다.</p>}
        {!weather && !weatherError && <p>불러오는 중…</p>}
        {weather && (
          <p>
            {weather.minTemp}℃ ~ {weather.maxTemp}℃ · 강수확률 {weather.pop}%
            {weather.needUmbrella && " → 우산 챙기세요!"}
          </p>
        )}
      </article>

      <article>
        <h3>😷 미세먼지</h3>
        {airError && <p role="alert">미세먼지 정보를 불러오지 못했습니다.</p>}
        {!air && !airError && <p>불러오는 중…</p>}
        {air && (
          <p>
            PM2.5 {air.pm25}({GRADE_LABEL[air.pm25Grade]}) · PM10 {air.pm10}(
            {GRADE_LABEL[air.pm10Grade]})
            {air.needMask && " → 마스크 권장"}
          </p>
        )}
      </article>

      <article>
        <h3>🚇 {fav.departure}역 도착 정보</h3>
        {arrivalsError && <p role="alert">도착 정보를 불러오지 못했습니다.</p>}
        {!arrivals && !arrivalsError && <p>불러오는 중…</p>}
        {arrivals && arrivals.length === 0 && <p>도착 예정 열차가 없습니다.</p>}
        {arrivals && arrivals.length > 0 && (
          <ul>
            {arrivals.slice(0, 6).map((a, i) => (
              <li key={i}>
                [{a.direction}] {a.dest} — {a.message}
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

export default Briefing;
