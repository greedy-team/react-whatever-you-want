const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface MissingPerson {
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
  tknphotolength: number;
  tknphotoFile: string;
}

interface FetchPageResult {
  list: MissingPerson[];
  hasMore: boolean;
}

async function fetchMissingPersonsRaw(
  rowSize: number,
  page: number,
  gender?: string,
  age?: string,
): Promise<FetchPageResult> {
  const params = new URLSearchParams({
    rowSize: String(rowSize),
    page: String(page),
  });
  if (gender && gender !== "none") params.append("sexdstnDscd", gender);
  if (age && age !== "none") params.append("age", age);

  const res = await fetch(`${BASE_URL}/missing-persons?${params}`);
  const data = await res.json();

  if (data.result !== "00") {
    throw new Error(data.msg || "데이터를 불러오지 못했습니다");
  }

  return {
    list: data.list as MissingPerson[],
    hasMore: Boolean(data.hasMore),
  };
}

const MAX_ATTEMPTS = 3;

export interface FetchMissingPersonsParams {
  rowSize: number;
  page: number;
  gender?: string;
  age?: string;
}

export interface FetchMissingPersonsResult {
  list: MissingPerson[];
  lastTriedPage: number;
  exhausted: boolean;
}

export async function fetchMissingPersons({
  rowSize,
  page,
  gender,
  age,
}: FetchMissingPersonsParams): Promise<FetchMissingPersonsResult> {
  let currentPage = page;
  let attempts = 0;
  let list: MissingPerson[] = [];
  let exhausted = false;

  while (attempts < MAX_ATTEMPTS) {
    const result = await fetchMissingPersonsRaw(
      rowSize,
      currentPage,
      gender,
      age,
    );
    attempts++;

    if (result.list.length > 0) {
      list = result.list;
      break; // 결과를 찾았으니 멈춤
    }

    if (!result.hasMore) {
      exhausted = true; // 서버 원본 데이터 자체가 끝남
      break;
    }

    currentPage++; // 다음 페이지로 이동해서 재시도
  }

  return {
    list,
    lastTriedPage: currentPage,
    exhausted,
  };
}
