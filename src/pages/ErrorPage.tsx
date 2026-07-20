import { isRouteErrorResponse, useRouteError, Link } from "react-router";

// 상태 코드별 사용자 친화 메시지 (없는 코드는 기본 메시지로 대체)
const ERROR_MESSAGE: Record<number, string> = {
  404: "페이지를 찾을 수 없습니다.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
};
const DEFAULT_MESSAGE = "알 수 없는 문제가 발생했습니다.";

// 라우팅/렌더링 중 에러가 나면 라우터가 이 화면으로 대신 보여준다
function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = ERROR_MESSAGE[status] ?? DEFAULT_MESSAGE;

  return (
    <section>
      <h2>문제가 생겼어요 (에러 코드 {status})</h2>
      <p>{message}</p>
      <button type="button" onClick={() => history.back()}>
        이전 페이지로
      </button>
      <Link to="/">홈으로</Link>
    </section>
  );
}

export default ErrorPage;
