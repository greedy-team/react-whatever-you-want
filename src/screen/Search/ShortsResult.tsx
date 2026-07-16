// ShortsResult.tsx (같은 폴더에 별도 파일로 빼도 되고, 같은 파일 안에 둬도 됩니다)
import type { MissingPerson } from "../../hooks/missingPersons"; // 실제 타입 export 경로에 맞게 수정
import { getTargetLabel } from "../../hooks/getTargetLabel";

interface ShortsResultProps {
  isFetching: boolean;
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
  isFetching,
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
  if ( isFetching) return <p>불러오는 중...</p>;
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

      {current.tknphotoFile && (
        <img
          src={`data:image/jpeg;base64,${current.tknphotoFile}`}
          alt={current.nm}
          style={{ maxWidth: "100%", height: "auto", margin: "12px 0" }}
        />
      )}
      <p>
        <strong>{current.nm}</strong>
      </p>
      <p>
        성별: {current.sexdstnDscd} / 당시나이: {current.age}세 / 현재나이:{" "}
        {current.ageNow}세
      </p>
      <p>신체특징: {current.etcSpfeatr || "정보 없음"}</p>
      <p>발생일: {current.occrde}</p>
      <p>발생장소: {current.occrAdres}</p>
      <p>착의사항: {current.alldressingDscd || "정보 없음"}</p>
      <p>대상구분: {getTargetLabel(current.writngTrgetDscd)}</p>

      <button
        onClick={onNext}
        disabled={currentIndex === resultsLength - 1 && !hasNext}
      >
        ▼ 다음
      </button>
    </div>
  );
}
