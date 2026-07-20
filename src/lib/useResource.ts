import { useState } from "react";
import { errorMessage } from "./errorMessage";

// weather/air/arrivals가 공통으로 쓰는 "불러오기 시작 → 성공/실패" 상태 관리를 뽑아낸 훅
export function useResource<T>(initialValue: T | null) {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function start() {
    setData(null);
    setError(null);
  }

  function load(promise: Promise<T>, onSuccess?: (value: T) => void) {
    promise
      .then((value) => {
        onSuccess?.(value);
        setData(value);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError(errorMessage(err));
      });
  }

  return { data, error, start, load };
}
