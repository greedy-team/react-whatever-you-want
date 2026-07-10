import { useState } from "react";
import { getFavorite, saveFavorite } from "../lib/favorites";

// 출발역·도착역 저장
function Favorites() {
  const [fav, setFav] = useState(getFavorite);
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveFavorite(fav);
    setSaved(true);
  }

  return (
    <section>
      <h2>나의 즐겨찾기</h2>
      <p>출발역을 저장하면 브리핑의 지하철 도착 정보에 반영됩니다.</p>

      <form onSubmit={handleSubmit}>
        <label>
          출발역
          <input
            value={fav.departure}
            onChange={(e) => {
              setFav({ ...fav, departure: e.target.value });
              setSaved(false);
            }}
            placeholder="예: 아차산"
            required
          />
        </label>

        <label>
          도착역
          <input
            value={fav.arrival}
            onChange={(e) => {
              setFav({ ...fav, arrival: e.target.value });
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
