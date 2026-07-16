import { getTargetLabel } from "../hooks/getTargetLabel";
import type { MissingPerson } from "../hooks/missingPersons";

interface MissingPersonProfileProps {
  person: MissingPerson;
}

export function MissingPersonProfile({ person }: MissingPersonProfileProps) {
  return (
    <>
      {person.tknphotoFile && (
        <img
          src={`data:image/jpeg;base64,${person.tknphotoFile}`}
          alt={`${person.nm}의 사진`}
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
    </>
  );
}
