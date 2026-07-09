import { useState, useEffect } from "react";

interface MissingPerson {
  rnum: number;
  occrde: string;
  alldressingDscd: string | null; // null 가능성 있음
  ageNow: string; // 문자열 타입 주의
  age: number;
  writngTrgetDscd: string;
  sexdstnDscd: string;
  etcSpfeatr: string;
  occrAdres: string;
  nm: string;
  msspsnIdntfccd: number;
  tknphotolength: number;
  tknphotoFile: string;
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
export function ListScreen() {
  const [results, setResults] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        rowSize: "10",
      });

      try {
        const res = await fetch(
          `http://localhost:4000/api/missing-persons?${params}`,
        );
        const data = await res.json();

        if (data.result === "00") {
          setResults(data.list);
        } else {
          setError(data.msg || "데이터를 불러오지 못했습니다");
        }
      } catch (err) {
        console.error(err);
        setError("서버 연결에 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <h1>List Screen</h1>
      {results.length === 0 ? (
        <p>결과가 없습니다.</p>
      ) : (
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
                성별: {person.sexdstnDscd} / 당시나이: {person.age}세 /
                현재나이: {person.ageNow}세
              </p>
              <p>신체특징: {person.etcSpfeatr || "정보 없음"}</p>
              <p>발생일: {person.occrde}</p>
              <p>발생장소: {person.occrAdres}</p>

              <p>착의사항: {person.alldressingDscd || "정보 없음"}</p>
              <p>대상구분: {getTargetLabel(person.writngTrgetDscd)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
