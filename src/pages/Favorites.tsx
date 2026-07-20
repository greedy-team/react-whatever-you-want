import { useState } from "react";
import { getFavorite, saveFavorite } from "../lib/favorites";
import { STATION_FULL_NAME } from "../lib/stationNames";
import StationCombobox from "../components/StationCombobox";

// 출발역·도착역 저장
function Favorites() {
  const [fav, setFav] = useState(getFavorite);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 부역명 짧게 입력해도 실시간 도착 API가 요구하는 전체명으로 보정
    saveFavorite({
      ...fav,
      departure: STATION_FULL_NAME[fav.departure] ?? fav.departure,
    });
    setSaved(true);
  }

  return (
    <section>
      <h2>나의 즐겨찾기</h2>
      <p>출발역을 저장하면 브리핑의 지하철 도착 정보에 반영됩니다.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="departure">
          출발역
          <StationCombobox
            id="departure"
            value={fav.departure}
            onChange={(departure) => {
              setFav({ ...fav, departure });
              setSaved(false);
            }}
            placeholder="예: 아차산(어린이대공원후문)"
            required
          />
        </label>

        <label htmlFor="arrival">
          도착역
          <StationCombobox
            id="arrival"
            value={fav.arrival}
            onChange={(arrival) => {
              setFav({ ...fav, arrival });
              setSaved(false);
            }}
            placeholder="예: 시청 (메모용)"
          />
        </label>

        <button type="submit">저장</button>
        {saved && <span role="status">저장되었습니다.</span>}
      </form>
    </section>
  );
}

export default Favorites;
