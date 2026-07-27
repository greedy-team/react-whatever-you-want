// src/test/fixtures/missingPersons.dummy.ts
import type { MissingPerson } from "../api/missingPersons";

const maleNames = [
  "김민준",
  "이서준",
  "박도윤",
  "최시우",
  "정하준",
  "강주원",
  "조지호",
  "윤준서",
  "장예준",
  "임건우",
];

const femaleNames = [
  "김서연",
  "이지우",
  "박하윤",
  "최지안",
  "정서윤",
  "강채원",
  "조수아",
  "윤유나",
  "장다은",
  "임소율",
];

function createDummy(
  id: number,
  name: string,
  gender: "1" | "2",
): MissingPerson {
  return {
    rnum: id,
    msspsnIdntfccd: id,
    nm: name,
    sexdstnDscd: gender, // "1" 남자, "2" 여자
    age: 35,
    ageNow: "42",
    occrde: "20240101",
    occrAdres: "서울특별시 강남구",
    etcSpfeatr: "오른쪽 팔에 화상 흉터",
    alldressingDscd: "검정색 패딩, 청바지",
    writngTrgetDscd: "010",
    tknphotoFile: "",
    tknphotolength: 0,
  };
}

export const mockMalePersons: MissingPerson[] = maleNames.map((name, i) =>
  createDummy(i * 2 + 2, name, "1"),
);

export const mockFemalePersons: MissingPerson[] = femaleNames.map((name, i) =>
  createDummy(i * 2 + 1, name, "2"),
);

export const mockMissingPersons: MissingPerson[] = [
  ...mockMalePersons,
  ...mockFemalePersons,
];
