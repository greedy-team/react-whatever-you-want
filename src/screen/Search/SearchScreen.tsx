import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMissingPersons } from "../../hooks/missingPersons";
import { getTargetLabel } from "../../hooks/getTargetLabel";
const AGE_OPTIONS = [
  "none",
  "0",
  "10",
  "20",
  "30",
  "40",
  "50",
  "60",
  "70",
  "80",
];
const ROW_SIZE = 10;

function getAgeLabel(value: string): string {
  if (value === "none") return "선택안함";
  if (value === "0") return "10살미만";
  if (value === "80") return "80대이상";
  return `${value}대`;
}

export function SearchScreen() {
  const genderRef = useRef<HTMLSelectElement>(null);
  const ageRef = useRef<HTMLSelectElement>(null);

  const [gender, setGender] = useState<string>("none");
  const [age, setAge] = useState<string>("none");
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searched, setSearched] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["missingPersons", "search", { gender, age, page }],
    queryFn: () =>
      fetchMissingPersons({ rowSize: ROW_SIZE, page, gender, age }),
    enabled: searched,
    placeholderData: keepPreviousData,
  });

  const results = data?.list ?? [];
  const current = results[currentIndex];
  const hasNext = !!data && !data.exhausted;

  function handleSearch() {
    setGender(genderRef.current?.value ?? "none");
    setAge(ageRef.current?.value ?? "none");
    setPage(1);
    setCurrentIndex(0);
    setSearched(true);
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (page > 1) {
      setPage((prev) => prev - 1);
      setCurrentIndex(0);
    }
  }

  function handleNext() {
    if (results && currentIndex < results.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (data && hasNext) {
      setPage(data.lastTriedPage + 1);
      setCurrentIndex(0);
    }
  }

  function renderResult() {
    if (isLoading) return <p>불러오는 중...</p>;
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
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 && page === 1}
        >
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
          onClick={handleNext}
          disabled={currentIndex === results.length - 1 && !hasNext}
        >
          ▼ 다음
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Search Screen</h1>
      <div>
        <label htmlFor="gender-select">성별</label>
        <select ref={genderRef} id="gender-select">
          <option value="none">선택안함</option>
          <option value="1">남자</option>
          <option value="2">여자</option>
        </select>

        <label htmlFor="age-select">나이</label>
        <select ref={ageRef} id="age-select">
          {AGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {getAgeLabel(option)}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch}>찾아보기</button>

      {renderResult()}
    </div>
  );
}
