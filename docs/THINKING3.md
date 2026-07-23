# 03. 테스트 코드 작성 및 커버리지 향상

## 🎯 요구사항

1. 기존에 구현한 주요 기능에 대한 테스트 코드를 작성한다.
2. 사용자 관점에서 동작을 검증하는 테스트를 우선한다.
3. 무엇을 테스트할 것인지 고민하고, 그 내용을 PR에 기술한다.
4. 테스트를 위해 불필요한 로직 변경은 지양한다.
5. `npm run test` 를 통해 테스트를 실행할 수 있어야 한다.

# WHAT?

## 이미 작성된 기능을 대상으로 테스트 코드 작성

새 기능을 얹는 게 아니라 STEP1~2에서 이미 만든 것들 검증이 목표.

- `src/api/*` — weather, air, subway, subwayStations: 외부 API 응답을 우리 타입으로 파싱하는 로직
- `src/lib/errorMessage.ts` — unknown 에러를 문자열로 뽑아내는 헬퍼
- `scripts/send-briefing.ts` — 200자 초과 시 말줄임표 처리 로직
- `src/components/StationCombobox.tsx` — 사용자 인터랙션(입력 → 필터링 → 선택)

# WHERE?

## send-briefing.ts, 각종 src/api/\*

- 이게 실질적인 깃허브에서 돌아가는 코드임

`.github/workflows/briefing.yml`이 매일 정해진 시간에 `npm run briefing`(`send-briefing.ts`)을 실행한다. 화면에 안 뜨고 크론으로 조용히 돌기 때문에, 파싱이 깨지거나 200자 처리가 잘못돼도 사람이 바로 못 알아챈다. 그래서 브라우저에서 눈으로 확인하는 `Briefing.tsx`보다, 오히려 아무도 안 보는 이 경로가 먼저 테스트로 잡혀야 한다.

`src/api/*`는 `send-briefing.ts`와 `Briefing.tsx` 양쪽에서 같이 쓰는 공통 로직이라, 여기 하나를 테스트하면 두 진입점을 동시에 검증하는 셈이다.

# WHY?

## api 에 있는 코드를 테스트 돌려야 제대로 오는지 판단 가능함

- 공기, 에러구문, 지하철, 지하철 역정보, 날씨

`src/api/*`는 fetch로 외부 API를 직접 부르고, 응답 JSON을 우리 타입(`WeatherSummary`, `AirSummary` 등)으로 재조립하는 게 핵심 로직이다. 실제 API를 매번 호출하면서 확인할 순 없으니, 실제 응답 형태를 흉내 낸 fixture로 fetch를 흉내 내서:

- 정상 응답이 왔을 때 값이 우리가 기대한 필드로 제대로 매핑되는지 (`weather.ts`의 시간별 응답 재조립, `air.ts`의 등급→마스크 필요 여부 판단)
- 실패 응답(HTTP 에러, `resultCode !== "00"`, 지하철의 `errorMessage.code`가 `INFO-000`이 아닌 경우 등)일 때 `ApiError`로 제대로 던지는지

두 가지를 확인하는 게 목적. 사용자 관점에서는 "화면에 값이 제대로 뜨는지 / 실패하면 에러가 제대로 보이는지"와 같은 말이라, 요구사항 2번(사용자 관점 검증)과도 맞닿아 있다.

# HOW?

## Vitest, Jest

- 각각 장단점
  - Vitest
    - Vite로 빌드하는 프로젝트라 `vite.config.ts` 설정(플러그인, alias)을 그대로 재사용할 수 있다. 별도 babel/ts-jest 변환 설정이 필요 없다.
    - ESM 네이티브라 `import.meta.env`를 쓰는 `src/api/constants.ts`와 마찰이 없다. Jest는 ESM 지원이 아직 실험적이라 이 부분에서 추가 설정이 필요하다.
    - jsdom 환경을 옵션 하나로 켤 수 있어서 `StationCombobox` 같은 컴포넌트 테스트도 같은 러너로 처리 가능.
    - 실행 속도가 빠르고(esbuild 기반), watch 모드가 Vite dev server와 같은 방식이라 익숙하다.

  - Jest
    - 생태계가 가장 크고 레퍼런스가 많다. CRA 등 기존 프로젝트에선 기본값.
    - 이 프로젝트처럼 Vite + ESM 조합에서는 설정(babel-jest, transform, moduleNameMapper)이 한 겹 더 필요하고, `import.meta.env`를 그대로 못 쓴다.

이 프로젝트는 Vite 기반이라 설정 중복을 피하려고 **Vitest**를 선택.

## 주요 테스트 API

| API                 | 역할                                                        |
| ------------------- | ----------------------------------------------------------- |
| `describe`          | 관련 테스트를 하나의 그룹으로 묶는다.                       |
| `it`                | 개별 테스트와 검증할 동작을 정의한다. `test`와 기능은 같다. |
| `render`            | 테스트할 React 컴포넌트를 렌더링한다.                       |
| `screen`            | 렌더링된 DOM 요소를 조회한다.                               |
| `expect`            | 실제 결과가 예상 결과와 일치하는지 검증한다.                |
| `vi.fn`             | 실제 함수 대신 사용할 가짜 함수(mock)를 만든다.             |
| `beforeEach`        | 각 테스트가 실행되기 전에 준비 작업을 수행한다.             |
| `mockReset`         | 이전 테스트의 mock 응답과 호출 기록을 초기화한다.           |
| `mockResolvedValue` | mock 함수가 반환할 Promise 결과를 지정한다.                 |
| `fireEvent`         | 클릭이나 입력 같은 DOM 이벤트를 발생시킨다.                 |
| `getByText`         | 지정한 텍스트를 가진 DOM 요소를 찾는다.                     |

### 기본 테스트 구조

## 테스트 팁

1. 테스트 이름에 동작을 적기
2. 실제 결과를 구체적으로 검증하기
3. 정상과 실패를 모두 테스트하기
4. 외부 환경에 의존하지 않기
5. 테스트 대상은 mock 하지 않기
6. 함수의 분기를 보고 케이스 정하기

`describe`로 관련 테스트를 묶고, `it`으로 테스트 이름과 검증할 동작을 정의한다.

`expect(실제값).toBe(기대값)`은 실제 결과가 기대값과 정확히 같은지 검증한다. 문자열, 숫자, 불리언은 주로 `toBe()`를 사용하고, 객체나 배열의 내용은 `toEqual()`로 비교한다.

- `vi.fn()`으로 실제 네트워크 요청 대신 실행할 가짜 `fetch` 함수를 만든다.
- `global.fetch = fetchMock`으로 테스트 중 호출되는 `fetch`를 가짜 함수로 교체한다.
- `beforeEach()`와 `mockReset()`으로 각 테스트 전에 이전 테스트의 응답과 호출 기록을 지운다.
- `mockResolvedValue()`로 해당 테스트에서 사용할 가짜 API 응답을 설정한다.

참고: [React에서 테스트 코드 작성해보기](https://velog.io/@wmc1415/React%EC%97%90%EC%84%9C-Test-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1%ED%95%B4%EB%B3%B4%EA%B8%B0)
