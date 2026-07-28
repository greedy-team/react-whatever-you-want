// catch(err)에서 잡힌 값은 타입이 unknown이라, 안전하게 문자열로 뽑아내는 헬퍼
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "알 수 없는 오류";
}
