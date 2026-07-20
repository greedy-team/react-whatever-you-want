import { getTargetLabel } from "../utils/getTargetLabel";
import type { MissingPerson } from "../api/missingPersons";
import styles from "./MissingPersonProfile.module.css";

interface MissingPersonProfileProps {
  person: MissingPerson;
}

export function MissingPersonProfile({ person }: MissingPersonProfileProps) {
  const genderLabel =
    person.sexdstnDscd === "1"
      ? "남자"
      : person.sexdstnDscd === "2"
        ? "여자"
        : person.sexdstnDscd;

  return (
    <article
      className={styles.profile}
      aria-label={`${person.nm}의 실종자 정보`}
    >
      {person.tknphotoFile ? (
        <img
          className={styles.photo}
          src={`data:image/jpeg;base64,${person.tknphotoFile}`}
          alt={`${person.nm}의 사진`}
        />
      ) : (
        <div className={styles.photoPlaceholder}>사진 없음</div>
      )}

      <header className={styles.header}>
        <h2 className={styles.name}>{person.nm}</h2>
        <span className={styles.badge}>
          {getTargetLabel(person.writngTrgetDscd)}
        </span>
      </header>

      <dl className={styles.info}>
        <dt>성별</dt>
        <dd>{genderLabel}</dd>

        <dt>당시나이</dt>
        <dd>{person.age}세</dd>

        <dt>현재나이</dt>
        <dd>{person.ageNow}세</dd>

        <dt>발생일</dt>
        <dd>{person.occrde}</dd>
      </dl>

      <dl className={styles.info}>
        <dt>발생장소</dt>
        <dd>{person.occrAdres}</dd>

        <dt>신체특징</dt>
        <dd>
          {person.etcSpfeatr || (
            <span className={styles.emptyValue}>정보 없음</span>
          )}
        </dd>

        <dt>착의사항</dt>
        <dd>
          {person.alldressingDscd || (
            <span className={styles.emptyValue}>정보 없음</span>
          )}
        </dd>
      </dl>
    </article>
  );
}
