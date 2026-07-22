// src/components/Layout/Layout.tsx
import { Outlet, useNavigation } from "react-router-dom";
import styled from "styled-components";
import Header from "../Header/Header";

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(20, 20, 20, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #333;
  border-top: 5px solid #e50914; /* FlixDrop 시그니처 레드 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.h2`
  font-size: 20px;
  color: #ffffff;
  font-weight: 500;
  font-family: "Noto Sans KR", sans-serif;
`;

export default function Layout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <>
      <Header />
      {isLoading && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>
            <span aria-hidden="true">🍿</span> 취향을 기반으로 영화 탐색 중...
          </LoadingText>
        </LoadingOverlay>
      )}
      <Outlet />
    </>
  );
}
