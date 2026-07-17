import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { UI_GENRES, UI_ERAS } from "../../constants/movieFilters";
import type { Movie } from "../../types/movie";
import { STORAGE_KEYS } from "../../constants/storage";
import { movieQueryOptions } from "../../apis/movie";

export default function ResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const genre = searchParams.get("genre");
  const era = searchParams.get("era");

  const { data: movieData } = useQuery({
    ...movieQueryOptions(genre, era),
    throwOnError: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.floor(Math.random() * 20),
  );

  const movies = movieData?.results || [];

  const safeIndex = movies.length > 0 ? selectedIndex % movies.length : 0;

  const randomMovie = movies[safeIndex] || null;

  const handleRepick = () => {
    if (movies.length <= 1) return;

    let nextIndex = selectedIndex;
    while (nextIndex === selectedIndex) {
      nextIndex = Math.floor(Math.random() * movies.length);
    }
    setSelectedIndex(nextIndex);
  };

  const handleSaveToHistory = () => {
    if (!randomMovie) return;

    const existingHistory = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.FLIXDROP_HISTORY) || "[]",
    );

    const duplicateArray = existingHistory.filter(
      (item: Movie) => item.id === randomMovie.id,
    );

    if (duplicateArray.length > 0) {
      alert("이미 보관함에 담긴 영화입니다!");
      return;
    }

    const newMovieItem: Movie = {
      id: randomMovie.id,
      title: randomMovie.title,
      genre: genre || "",
      era: era || "",
    };

    const updatedHistory = [newMovieItem, ...existingHistory];

    localStorage.setItem(
      STORAGE_KEYS.FLIXDROP_HISTORY,
      JSON.stringify(updatedHistory),
    );

    alert("보관함에 성공적으로 저장되었습니다!");
  };

  const movieTitle =
    randomMovie?.title || `선택하신 조건에 맞는 추천 영화가 없습니다.`;

  return (
    <ResultContainer>
      <ResultCard>
        <Title>FlixDrop 드롭 결과</Title>
        <InfoBlock>
          <HighlightText>
            {UI_GENRES.find((g) => g.key === genre)?.name || "전체"}
          </HighlightText>

          <InfoText>📅 선택한 시대</InfoText>
          <HighlightText>
            {UI_ERAS.find((e) => e.key === era)?.name || "전체"}
          </HighlightText>

          <MovieTitleSection>
            <InfoText>🎬 오늘의 추천 영화</InfoText>
            <MovieTitle>{movieTitle}</MovieTitle>
          </MovieTitleSection>
        </InfoBlock>

        {randomMovie && (
          <>
            <PrimaryButton
              onClick={handleSaveToHistory}
              aria-label="추천된 영화를 보관함에 저장하기"
            >
              🥳 보관함에 저장하기
            </PrimaryButton>
            <RepickButton
              onClick={handleRepick}
              aria-label="조건에 맞는 다른 영화 다시 추천받기"
            >
              🔄 다른 영화 추천받기
            </RepickButton>
          </>
        )}

        <SecondaryButton
          onClick={() => navigate("/")}
          aria-label="장르 및 시대 필터 선택 화면으로 돌아가기"
        >
          🔄 필터 다시 고르기
        </SecondaryButton>
      </ResultCard>
    </ResultContainer>
  );
}

const RepickButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #1c1c1c;
  color: #ffb800;
  border: 1px solid #ffb800;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    background-color: #ffb800;
    color: #000000;
  }
`;

const ResultContainer = styled.main`
  background-color: #141414;
  min-height: 100vh;
  padding: 40px 20px;
  color: #ffffff;
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultCard = styled.article`
  width: 100%;
  max-width: 450px;
  background-color: #000000;
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  text-align: center;
`;

const Title = styled.h2`
  color: #e50914;
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
`;

const InfoBlock = styled.div`
  background-color: #1c1c1c;
  padding: 24px;
  border-radius: 6px;
  margin-bottom: 30px;
  text-align: left;
`;

const InfoText = styled.p`
  font-size: 13px;
  color: #aaaaaa;
  margin: 0 0 4px 0;
`;

const HighlightText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 20px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MovieTitleSection = styled.div`
  margin-top: 15px;
  border-top: 1px solid #333333;
  padding-top: 15px;
`;

const MovieTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #ffb800;
  margin: 6px 0 0 0;
  line-height: 1.4;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #e50914;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b80710;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #2f2f2f;
  color: #ffffff;
  border: 1px solid #3f3f3f;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #3f3f3f;
  }
`;
