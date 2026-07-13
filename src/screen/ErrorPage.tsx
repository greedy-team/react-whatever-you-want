import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export function ErrorPage() {
  const error = useRouteError();

  const title = "문제가 발생했어요";
  let message = "알 수 없는 오류가 발생했습니다.";

  if (isRouteErrorResponse(error)) {
    // loader에서 throw new Response(...) 한 경우
    message = error.data || error.statusText || message;
  } else if (error instanceof Error) {
    // 일반 JS 에러가 던져진 경우 (네트워크 에러 등)
    message = error.message;
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
      }}
    >
      <h2>{title}</h2>
      <p style={{ color: "#666", marginBottom: "24px" }}>{message}</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}
