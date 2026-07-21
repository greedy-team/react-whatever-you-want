// API 실패를 종류별로 구분할 수 있도록 code를 들고 다니는 에러.
// code는 HTTP 상태 코드(`HTTP_500`) 또는 API가 응답 본문에 내려준 결과 코드(`INFO-200` 등)를 그대로 담는다.
export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}
