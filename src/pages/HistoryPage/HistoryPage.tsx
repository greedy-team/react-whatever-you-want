import { useState } from "react";
import styled from "styled-components";
import { UI_GENRES, UI_ERAS } from "../../constants/movieFilters";
import type {Movie}from "../../types/movie";
import { STORAGE_KEYS } from "../../constants/storage";

export default function HistoryPage(){
    const[movies,setMovies]=useState<Movie[]>(()=>{
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FLIXDROP_HISTORY)||"[]");
    });

    const handleDeleteMovie=(id:number)=>{
        const updatedMovies=movies.filter(movie=>movie.id!==id);

        setMovies(updatedMovies);

        localStorage.setItem(STORAGE_KEYS.FLIXDROP_HISTORY,JSON.stringify(updatedMovies));

        alert("보관함에서 삭제되었습니다! 🫙");
    };

    return(
        <HistoryContainer> 
            <Title>나의 FlixDrop 보관함</Title>
            <Subtitle>그동안 드롭으로 추천받았던 영화 목록입니다.</Subtitle>
            {movies.length===0?(
                <EmptyText>아직 보관함에 담긴 영화가 없습니다. 🍿</EmptyText>
            ):(
                <MovieList>
                    {movies.map((movie)=>(
                        <MovieCard key={movie.id}>
                            <MovieInfo>
                                <MovieTitle>{movie.title}</MovieTitle>
                                <MovieMeta>
                                    <span>🎭 {UI_GENRES.find(g => g.key === movie.genre)?.name || movie.genre}</span>
                                    <span> • </span>
                                    <span>📅 {UI_ERAS.find(e => e.key === movie.era)?.name || movie.era}</span>
                                </MovieMeta>
                            </MovieInfo>

                            <DeleteButton onClick={()=>handleDeleteMovie(movie.id)}>
                                지우기
                            </DeleteButton>
                        </MovieCard>
                    ))}
                </MovieList>
            )}
        </HistoryContainer>
    );
}

const HistoryContainer = styled.main`
    background-color: #141414;
    min-height: 100vh;
    padding: 40px 20px;
    color: #ffffff;
    font-family: 'Noto Sans KR', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 8px;
`;

const Subtitle = styled.p`
    font-size: 15px;
    color: #a3a3a3;
    margin-bottom: 40px;
    text-align: center;
`;

const MovieList = styled.div`
    width: 100%;
    max-width: 550px;
    display: flex;
    flex-direction: column;
    gap: 16px; 
`;

const MovieCard = styled.div`
    background-color: #1f1f1f;
    padding: 20px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between; 
    align-items: center;
    border: 1px solid #2a2a2a;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px); 
        border-color: #3f3f3f;
    }
`;

const MovieInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const MovieTitle = styled.h3`
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    margin: 0;
`;

const MovieMeta = styled.p`
    font-size: 13px;
    color: #aaaaaa;
    margin: 0;
    
    span {
        vertical-align: middle;
    }
`;

const EmptyText = styled.p`
    font-size: 16px;
    color: #737373;
    margin-top: 60px;
`;

const DeleteButton = styled.button`
    background-color: transparent;
    color: #e50914; /* 기본 글씨는 레드 */
    border: 1px solid #e50914;
    padding: 8px 14px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #e50914;
        color: #ffffff;
    }
`;
