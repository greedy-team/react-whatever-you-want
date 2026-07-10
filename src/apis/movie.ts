import {GENRE_MAP,UI_ERAS}from"../constants/movieFilters";

export const fetchMovieData=async(genre: string | null, era: string | null) => {
    const API_KEY="022081e1c47971a54a222e3eacfa4020";
    
    const tmdbGenreId = genre ? GENRE_MAP[genre.toLowerCase()] : "";
    const tmdbYear = era ? UI_ERAS.find(e=>e.key===era) : null;
    const dateParams=tmdbYear 
    ? `&primary_release_date.gte=${tmdbYear .gte}&primary_release_date.lte=${tmdbYear .lte}`
        : "";

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${tmdbGenreId}${dateParams}&language=ko-KR`;
    const response =await fetch(url);

    if(!response.ok){
        throw new Error("데이터를 가져오는데 실패했습니다.");
    }
    return response.json();
}