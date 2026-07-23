import { useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMissingPersons } from "../../api/missingPersons";
import { ShortsResult } from "./ShortsResult";

// const AGE_OPTIONS = [
//   "none",
//   "0",
//   "10",
//   "20",
//   "30",
//   "40",
//   "50",
//   "60",
//   "70",
//   "80",
// ];
const ROW_SIZE = 10;

// function getAgeLabel(value: string): string {
//   if (value === "none") return "선택안함";
//   if (value === "0") return "10살미만";
//   if (value === "80") return "80대이상";
//   return `${value}대`;
// }

export function SearchScreen() {
  const genderRef = useRef<HTMLSelectElement>(null);
  const ageRef = useRef<HTMLSelectElement>(null);

  const [gender, setGender] = useState<string>("none");
  const [age, setAge] = useState<string>("none");
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searched, setSearched] = useState(false);

  const { data, isFetching, error } = useQuery({
    queryKey: ["missingPersons", "search", { gender, age, page }],
    queryFn: () =>
      fetchMissingPersons({ rowSize: ROW_SIZE, page, gender, age }),
    enabled: searched,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
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
      setCurrentIndex(ROW_SIZE - 1);
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

  return (
    <div>
      <h1>Search Screen</h1>
      <fieldset>
        <legend>검색 조건</legend>
        <label htmlFor="gender-select">성별</label>
        <select ref={genderRef} id="gender-select">
          <option value="none">선택안함</option>
          <option value="1">남자</option>
          <option value="2">여자</option>
        </select>

        {/* <label htmlFor="age-select">나이</label>
        <select ref={ageRef} id="age-select">
          {AGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {getAgeLabel(option)}
            </option>
          ))}
        </select> */}
      </fieldset>
      <button onClick={handleSearch}>찾아보기</button>
      {isFetching && <p>불러오는중..</p>}

      <ShortsResult
        error={error}
        searched={searched}
        current={current}
        currentIndex={currentIndex}
        page={page}
        resultsLength={results.length}
        hasNext={hasNext}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
