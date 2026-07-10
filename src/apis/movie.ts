import {GENRE_MAP,ERA_MAP}from"../constants/movieFilters";

export const fetchMovieData=async(genre: string | null, era: string | null) => {
    const API_KEY="022081e1c47971a54a222e3eacfa4020";
    
    const tmdbGenreId = genre ? GENRE_MAP[genre.toLowerCase()] : "";
    const tmdbYear = era ? ERA_MAP[era] : "";

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${tmdbGenreId}&primary_release_year=${tmdbYear}&language=ko-KR`;

    const response =await fetch(url);

    if(!response.ok){
        throw new Error("데이터를 가져오는데 실패했습니다.");
    }
    return response.json();
}