// ShortsResult.tsx (같은 폴더에 별도 파일로 빼도 되고, 같은 파일 안에 둬도 됩니다)
import type { MissingPerson } from "../../api/missingPersons"; // 실제 타입 export 경로에 맞게 수정
import { MissingPersonProfile } from "../../components/MissingPersonProfile";

interface ShortsResultProps {
  error: Error | null;
  searched: boolean;
  current?: MissingPerson;
  currentIndex: number;
  page: number;
  resultsLength: number;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ShortsResult({
  error,
  searched,
  current,
  currentIndex,
  page,
  resultsLength,
  hasNext,
  onPrev,
  onNext,
}: ShortsResultProps) {
  if (error) return <p style={{ color: "red" }}>에러: {error.message}</p>;
  if (searched && !current) return <p>더 이상 결과가 없습니다.</p>;
  if (!current) return null;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "400px",
        margin: "20px auto",
        textAlign: "center",
      }}
    >
      <button onClick={onPrev} disabled={currentIndex === 0 && page === 1}>
        ▲ 이전
      </button>
      <MissingPersonProfile person={current}></MissingPersonProfile>
      <button
        onClick={onNext}
        disabled={currentIndex === resultsLength - 1 && !hasNext}
      >
        ▼ 다음
      </button>
    </div>
  );
}
