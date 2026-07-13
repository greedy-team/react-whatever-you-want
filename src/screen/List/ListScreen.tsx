import { fetchMissingPersons } from "../../hooks/missingPersons";
import { useQuery } from "@tanstack/react-query";

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

export function ListScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["missingPersons", "list", { rowSize: 10 }],
    queryFn: () => fetchMissingPersons({ rowSize: 10, page: 1 }),
  });

  const results = data?.list; // ⭐ 객체에서 list만 꺼내서 씀

  if (isLoading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>에러: {error.message}</p>;
  if (!results || results.length === 0) return <p>결과가 없습니다.</p>;

  return (
    <div>
      <h1>List Screen</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((person) => (
          <li
            key={person.msspsnIdntfccd}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "8px",
            }}
          >
            {person.tknphotoFile && (
              <img
                src={`data:image/jpeg;base64,${person.tknphotoFile}`}
                alt={person.nm}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
            <p>
              <strong>{person.nm}</strong>
            </p>
            <p>
              성별: {person.sexdstnDscd} / 당시나이: {person.age}세 / 현재나이:{" "}
              {person.ageNow}세
            </p>
            <p>신체특징: {person.etcSpfeatr || "정보 없음"}</p>
            <p>발생일: {person.occrde}</p>
            <p>발생장소: {person.occrAdres}</p>

            <p>착의사항: {person.alldressingDscd || "정보 없음"}</p>
            <p>대상구분: {getTargetLabel(person.writngTrgetDscd)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
