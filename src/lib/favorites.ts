export interface Favorite {
  departure: string; // 출발역 (지하철 조회)
  arrival: string; // 도착역 (저장만)
}

const KEY = "nagado.favorite";
const DEFAULT: Favorite = { departure: "아차산(어린이대공원후문)", arrival: "" };

export function getFavorite(): Favorite {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveFavorite(fav: Favorite): void {
  localStorage.setItem(KEY, JSON.stringify(fav));
}
