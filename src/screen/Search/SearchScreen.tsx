import { useRef, useState } from "react";

interface MissingPerson {
  rnum: number;
  occrde: string;
  alldressingDscd: string | null;
  ageNow: string;
  age: number;
  writngTrgetDscd: string;
  sexdstnDscd: string;
  etcSpfeatr: string;
  occrAdres: string;
  nm: string;
  msspsnIdntfccd: number;
  tknphotoFile: string;
}
import { useSearchParams } from "react-router";
export function SearchScreen() {
  const genderRef = useRef<HTMLSelectElement>(null);
  const ageRef = useRef<HTMLSelectElement>(null);

  const [results, setResults] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(false); // 검색 실행 여부
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // 검색 조건을 기억해뒀다가 다음 페이지 요청할 때도 재사용
  const [params, setParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const MAX_ATTEMPTS = 3;
  async function fetchResults(
    startPage: number,
    direction: "next" | "prev" = "next",
  ) {
    const gender = params.get("gender");
    const age = params.get("age");
    setLoading(true);
    setError(null);

    try {
      let targetPage = startPage;
      let attempts = 0;
      let filtered: MissingPerson[] = [];
      let lastSuccessPage = targetPage;

      while (attempts < MAX_ATTEMPTS) {
        const fetchParams = new URLSearchParams({
          rowSize: "10",
          page: String(targetPage),
        });
        if (gender && gender !== "none")
          fetchParams.append("sexdstnDscd", gender);

        const res = await fetch(`${BASE_URL}/missing-persons?${fetchParams}`);
        const data = await res.json();

        if (data.result !== "00") {
          setError(data.msg || "데이터를 불러오지 못했습니다");
          break;
        }

        let pageList = data.list;

        if (age && age !== "none") {
          const start = Number(age);
          const end = age === "80" ? 999 : start + 9;
          pageList = pageList.filter((person: MissingPerson) => {
            const currentAge = Number(person.ageNow);
            return currentAge >= start && currentAge <= end;
          });
        }

        lastSuccessPage = targetPage;

        if (pageList.length > 0) {
          filtered = pageList;
          break; // 결과 찾았으니 그만 시도
        }

        // 이번 페이지는 비어있음 -> 방향에 따라 다음/이전 페이지로
        targetPage = direction === "prev" ? targetPage - 1 : targetPage + 1;
        attempts++;

        if (targetPage < 1) break; // 1페이지 아래로는 못 감
      }

      if (filtered.length > 0) {
        // 결과가 있으면 정상적으로 갱신
        setResults(filtered);
        setCurrentIndex(direction === "prev" ? filtered.length - 1 : 0);
        setPage(lastSuccessPage);
        setHasNext(true);
      } else if (direction === "next") {
        setHasNext(false);
        return;
      } else {
        // prev로 성공했다면 다음 페이지(현재 페이지)는 다시 유효하다고 볼 수 있음
        setHasNext(true);
      }
    } catch {
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setParams({
      gender: genderRef.current?.value ?? "",
      age: ageRef.current?.value ?? "",
    });
    setSearched(true);
    setHasNext(true);
    fetchResults(1, "next"); // 검색은 항상 1페이지부터
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (currentIndex === 0 && page > 1) {
      // 이전 페이지로 이동
      fetchResults(page - 1, "prev");
    }
  }

  function handleNext() {
    if (currentIndex < results.length - 1) {
      // 아직 현재 페이지 안에 더 볼 사람이 있음
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 마지막 사람이었음 -> 다음 페이지 불러오기
      fetchResults(page + 1, "next");
    }
  }

  function getTargetLabel(code: string) {
    const map: Record<string, string> = {
      "010": "정상아동(18세미만)",
      "020": "가출인",
      "040": "시설보호무연고자",
      "060": "지적장애인",
      "061": "지적장애인(18세미만)",
      "062": "지적장애인(18세이상)",
      "070": "치매질환자",
      "080": "불상(기타)",
    };
    return map[code] || code;
  }

  const current = results[currentIndex];
  function renderResult() {
    if (loading && !current) return <p>불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>에러: {error}</p>;
    if (searched && !current) return <p>더 이상 결과가 없습니다.</p>;
    if (!current) return null; // 검색 전 초기 상태

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

        <button onClick={handleNext} disabled={!hasNext}>
          ▼ 다음
        </button>
      </div>
    );
  }
  const age = [0, 10, 20, 30, 40, 50, 60, 70, 80];
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
          {age.map((option) => (
            <option key={option} value={option}>
              {option === 0
                ? "10살미만"
                : option === 80
                  ? "80대이상"
                  : option + "대"}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch}>찾아보기</button>

      {renderResult()}
      {!hasNext && <p>이후결과없습니다</p>}
    </div>
  );
}
