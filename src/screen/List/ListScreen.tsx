import { useLoaderData } from "react-router";

interface MissingPerson {
  rnum: number; // 행 번호
  occrde: string; //발생일
  alldressingDscd: string | null; // 창의사항
  ageNow: string; // 현재나이
  age: number; //당시나이
  writngTrgetDscd: string;//대상구분코드 ex) 010->정상아동
  sexdstnDscd: string;//성별
  etcSpfeatr: string;//신체특징
  occrAdres: string;//발생장소
  nm: string; //이름
  msspsnIdntfccd: number;//실종자 식별코드
  tknphotolength: number;// 촬영된사진의 길이
  tknphotoFile: string;//촬영된 사진 파일
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
const BASE_URL = import.meta.env.VITE_BASE_URL;
export async function listLoader() {
  const params = new URLSearchParams({ rowSize: "10" });

  const res = await fetch(`${BASE_URL}/missing-persons?${params}`);
  const data = await res.json();

  if (data.result !== "00") {
    throw new Response(data.msg || "데이터를 불러오지 못했습니다", {
      status: 500,
    });
  }

  return data.list as MissingPerson[];
}

export function ListScreen() {
  const results = useLoaderData() as MissingPerson[];

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
