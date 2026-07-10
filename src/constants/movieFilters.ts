export const GENRE_MAP: Record<string, number> = {
    action: 28,
    comedy: 35,
    drama: 18,
    romance: 10749,
    thriller: 53,
    mystery: 9648,
    horror: 27,
    animation: 16,
    sf: 878
};

export const UI_GENRES = [
    { key: "action", name: "액션" },
    { key: "comedy", name: "코미디" },
    { key: "drama", name: "드라마" },
    { key: "romance", name: "로맨스" },
    { key: "thriller", name: "스릴러" },
    { key: "mystery", name: "미스테리" },
    { key: "horror", name: "공포" },
    { key: "animation", name: "만화" },
    { key: "sf", name: "SF" }
];

export const UI_ERAS = [
    { key: "2020s", name: "2020년대", gte: "2020-01-01", lte: "2029-12-31" },
    { key: "2010s", name: "2010년대", gte: "2010-01-01", lte: "2019-12-31" },
    { key: "2000s", name: "2000년대", gte: "2000-01-01", lte: "2009-12-31" },
    { key: "1990s", name: "1990년대", gte: "1990-01-01", lte: "1999-12-31" },
    { key: "1980s", name: "1980년대", gte: "1980-01-01", lte: "1989-12-31" }
];
