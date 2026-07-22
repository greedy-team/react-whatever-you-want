import { useRouteError, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function ErrorPage() {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
  };
  const navigate = useNavigate();

  const is404 = error?.status === 404;
  const errorMessage = is404
    ? "입력하신 주소가 잘못되었거나 존재하지 않는 페이지입니다."
    : "데이터를 불러오는 중 예기치 못한 문제가 발생했습니다.";

  return (
    <ResultContainer>
      <ResultCard>
        <Title>FlixDrop 에러 결과</Title>

        <InfoBlock>
          <HighlightText>
            {is404 ? (
              <>
                <span aria-hidden="true">🔍</span> 404 Page Not Found
              </>
            ) : (
              <>
                <span aria-hidden="true">⚠️</span> Application Error
              </>
            )}
          </HighlightText>

          <InfoText>
            <span aria-hidden="true">📅</span> 에러 안내
          </InfoText>
          <HighlightText>{errorMessage}</HighlightText>

          <MovieTitleSection>
            <InfoText>
              <span aria-hidden="true">🎬</span> 상세 내용
            </InfoText>
            <MovieTitle>
              {error?.statusText || error?.message || "Unknown Error"}
            </MovieTitle>
          </MovieTitleSection>
        </InfoBlock>

        <PrimaryButton
          onClick={() => navigate("/")}
          aria-label="장르 및 시대 선택 화면인 홈으로 돌아가기"
        >
          <span aria-hidden="true">🏠</span> 홈으로 돌아가기
        </PrimaryButton>
      </ResultCard>
    </ResultContainer>
  );
}

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

const ResultCard = styled.div`
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
