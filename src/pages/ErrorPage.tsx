import { isRouteErrorResponse, useRouteError } from "react-router";

// 라우팅/렌더링 중 에러가 나면 라우터가 이 화면으로 대신 보여준다
function ErrorPage() {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <section>
      <h2>문제가 생겼어요 (에러 코드 {status})</h2>
    </section>
  );
}

export default ErrorPage;
