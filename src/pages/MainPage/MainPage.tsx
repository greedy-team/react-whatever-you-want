import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UI_GENRES, UI_ERAS } from "../../constants/movieFilters";
import styled from "styled-components";

export default function MainPage() {
  const navigate = useNavigate();

  const [genre, setGenre] = useState<string>("");
  const [era, setEra] = useState("2020s");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!genre) {
      alert("장르를 먼저 선택해 주세요!");
      return;
    }

    navigate(`/result/random?genre=${genre}&era=${era}`);
  };

  return (
    <MainContainer>
      <Title>FlixDrop 영화 뽑기</Title>
      <form onSubmit={handleSubmit}>
        <SectionBlock as="section">
          <p id="genre-group-label">
            <b>어떤 장르를 원하시나요?</b>
          </p>
          <GenreRadioGroup
            role="radiogroup"
            aria-labelledby="genre-group-label"
          >
            {UI_GENRES.map((g) => (
              <GenreLabel key={g.key} $isActive={genre === g.key}>
                <VisuallyHiddenInput
                  type="radio"
                  name="genre"
                  value={g.key}
                  checked={genre === g.key}
                  onChange={() => setGenre(g.key)}
                />
                {g.name}
              </GenreLabel>
            ))}
          </GenreRadioGroup>

          <p>
            현재 선택된 장르:{" "}
            <span>
              {UI_GENRES.find((g) => g.key === genre)?.name || "없음"}
            </span>
          </p>
        </SectionBlock>

        <SectionBlock as="section">
          <StyledLabel htmlFor="era-select">
            선호하는 영화 시대를 골라보세요
          </StyledLabel>
          <StyledSelect
            id="era-select"
            value={era}
            onChange={(e) => setEra(e.target.value)}
          >
            {UI_ERAS.map((e) => (
              <option key={e.key} value={e.key}>
                {e.name}
              </option>
            ))}
          </StyledSelect>
        </SectionBlock>

        <br />
        <SubmitButton type="submit">드롭! 영화 뽑기</SubmitButton>
      </form>
    </MainContainer>
  );
}

const MainContainer = styled.main`
  background-color: #141414;
  min-height: 100vh;
  padding: 40px 20px;
  color: #ffffff;
  font-family: "Noto Sans KR", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: #e50914;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 30px;
`;

const SectionBlock = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 25px;

  span {
    color: #e50914;
    font-weight: bold;
  }
`;

const StyledLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 12px;
`;

const GenreRadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const GenreLabel = styled.label<{ $isActive: boolean }>`
  background-color: ${(props) => (props.$isActive ? "#e50914" : "#2f2f2f")};
  color: #ffffff;
  border: 1px solid ${(props) => (props.$isActive ? "#e50914" : "#3f3f3f")};
  padding: 10px 16px;
  margin: 4px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#b80710" : "#3f3f3f")};
  }
  &:focus-within {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }
`;

const VisuallyHiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px;
  background-color: #2f2f2f;
  color: #ffffff;
  border: 1px solid #3f3f3f;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 14px;
  background-color: #e50914;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b80710;
  }
`;
