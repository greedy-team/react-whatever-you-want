import { fetchMissingPersons } from "../../hooks/missingPersons";
import { useQuery } from "@tanstack/react-query";
import { MissingPersonProfile } from "../../components/MissingPersonProfile";

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
            <MissingPersonProfile person={person}></MissingPersonProfile>
          </li>
        ))}
      </ul>
    </div>
  );
}
