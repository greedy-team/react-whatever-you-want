# 01. 페이지 구성 및 라우팅

## 🎯 요구사항

- React Router를 사용해 **2개 이상의 페이지 뷰**를 구현하세요.
- 모든 페이지에 공통으로 노출되는 **네비게이션 바**를 구현하세요.
- 각 페이지는 **명확히 구분되는 역할**을 가져야 합니다.
- **API를 활용해 데이터를 조회**하고 화면에 렌더링하세요.
- 페이지 전환 시 **전체 페이지 새로고침이 발생하지 않아야** 합니다.

- [React Router 공식 문서](https://reactrouter.com/)
- [한 입 크기로 잘라먹는 타입스크립트](https://ts.winterlood.com/)
- [기상청 단기예보 조회서비스](https://www.data.go.kr/data/15084084/openapi.do)
- [에어코리아 대기오염정보](https://www.data.go.kr/data/15073861/openapi.do)
- [서울 지하철 실시간 도착정보](https://data.seoul.go.kr/dataList/OA-12764/A/1/datasetView.do)
- [카카오 디벨로퍼스](https://developers.kakao.com/)
- [카카오톡 메시지 API - 나에게 보내기(기본 템플릿)](https://developers.kakao.com/docs/ko/kakaotalk-message/rest-api#default-template-msg-me)
- [카카오톡 메시지 API - 공통 개요](https://developers.kakao.com/docs/ko/kakaotalk-message/common#kakaotalk)

# WHAT?

## 페이지가 여러 개 필요하다 -> 라우터가 필요하다

`useState`로 지금 보고 있는 페이지를 들고 있어도 화면은 바뀐다. 근데 주소가 안 바뀌니까 새로고침하면 처음으로 돌아가고, 뒤로가기도 안 먹는다.

주소를 보고 화면을 정하게 만들자 -> React Router.

### 처음엔 `<BrowserRouter>` + `<Routes>`(선언적 모드)로 시작, 지금은 `createBrowserRouter`(데이터 모드)

선언적 모드는 JSX 트리로 라우트를 적고, 렌더링은 라우터가 하지만 데이터 요청은 각 페이지 컴포넌트(`useEffect`)가 알아서 한다.

데이터 모드는 라우트를 배열/객체로 정의하고, `loader`를 붙이면 라우터가 렌더링과 데이터 요청을 같이 담당한다. 지금 프로젝트는 `useEffect`로 불러오는 방식을 그대로 쓰고 있어서 `loader`의 이점을 아직 못 쓰고 있지만, 나중에 라우트 전환 전에 데이터를 미리 불러오거나(prefetch) 로딩/에러 상태를 라우터가 관리하게 바꾸려면 지금 구조가 더 유리해서 미리 옮겨뒀다.

```tsx
// main.tsx
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Briefing /> },
      { path: "favorites", element: <Favorites /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
```

# WHERE?

## 네비게이션 바

네비게이션은 모든 페이지에 나온다 -> 페이지마다 각자 그리면 페이지 추가할 때 빠뜨린다 -> **컴포넌트로 분리**해서 한 군데서만 그리자.

처음엔 `App`(라우트 최상위, Provider 자리)과 `Layout`(네비게이션 바 + `<Outlet />`)을 따로 뒀다. 근데 지금은 레이아웃이 하나뿐이라 `App`이 아무것도 안 하고 `Layout`을 감싸기만 하는 빈 껍데기였다. `Layout.tsx`를 지우고 그 안 내용을 `App.tsx`로 합쳤다. React Router에서는 `<Outlet />`이 "여기에 자식 페이지가 들어온다"는 자리다.

나중에 전역 Provider(테마, 에러 바운더리 등)가 필요해지면 그때 `App`을 다시 라우트 최상위 껍데기로 분리하면 된다.

## 페이지를 어떻게 나눌까

API가 3개니까 페이지도 3개(날씨/미세먼지/지하철)로 나눌 수 있다. 근데 그건 데이터 기준이지 사용자 기준이 아니다.

처음엔 "브리핑 / 지하철" 둘로 나눴다. 근데 날씨·미세먼지·지하철은 결국 아침에 한 번에 보고 싶은 거라 페이지를 오갈 이유가 없었다. 그래서 브리핑 한 페이지에 셋 다 넣었다.

그럼 두 번째 페이지는? 지하철 도착을 보려면 "어느 역"인지 알아야 한다. 그 역을 저장하는 즐겨찾기 페이지로 만들었다.

- `/` 브리핑 -> 날씨 + 미세먼지 + 지하철 도착을 다 보여준다 (**조회**)
- `/favorites` 즐겨찾기 -> 출발역/도착역을 입력하고 저장한다 (**설정**)

역할이 "보여주는 페이지 / 설정하는 페이지"로 갈린다. API 3개랑 페이지 2개가 안 맞는 게 오히려 데이터가 아니라 하는 일로 나눴다는 뜻.

# WHY?

## `<a>` 말고 `<Link>`

`<a>`로 이동하면 브라우저가 페이지를 통째로 새로 받아온다. 요구사항 5번이 이걸 하지 말라는 거다.

`<Link>`(정확히는 `<NavLink>`)는 주소만 바꾸고 컴포넌트만 갈아끼운다. 실제로 새로고침이 안 나는지 확인해봤다.

```
클릭 전   /           오늘의 브리핑
클릭 후   /favorites  나의 즐겨찾기
페이지에 심어둔 값이 그대로 남아있음 -> 새로고침 안 됨 ✅
```

## `<Link>` 말고 `<NavLink>`

지금 어느 페이지인지 표시하고 싶다. `<Link>`로 하면 현재 주소를 직접 가져와서 비교해야 한다.

`<NavLink>`는 현재 페이지면 알아서 표시를 붙여준다. 그거 그대로 CSS에서 쓰면 된다.

## 404 페이지는 지금 안 만든다

요구사항에 없다. 페이지도 두 개뿐이다. 나중에 필요하면 한 줄 추가하면 된다.

# HOW?

### `src/pages/*`에 페이지, `src/api/*`에 API 호출

```
src/
├── main.tsx                 createBrowserRouter + <RouterProvider>
├── App.tsx                  네비게이션 바 + <Outlet />
├── api/
│   ├── constants.ts         엔드포인트/키 상수
│   ├── weather.ts           기상청 단기예보
│   ├── air.ts                에어코리아 미세먼지
│   └── subway.ts             서울 지하철 실시간
├── lib/favorites.ts         출발역 저장 (localStorage)
└── pages/
    ├── Briefing.tsx         /           날씨 + 미세먼지 + 지하철
    └── Favorites.tsx        /favorites  출발역/도착역 저장
```

## 경로 목록

```tsx
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Briefing /> },
      { path: "favorites", element: <Favorites /> },
    ],
  },
]);
```

App에는 주소를 안 줬다. 화면을 감싸기만 하고 주소는 차지하지 않는다.

## App

`<div>` 말고 `<header>`, `<nav>`, `<main>`을 썼다. 화면은 똑같지만 뭐가 뭔지 드러난다.

## API 상수

`api/constants.ts`에 각 API의 엔드포인트와 인증키(`import.meta.env`)를 모아뒀다. `weather.ts`/`air.ts`/`subway.ts`가 여기서 값을 가져다 쓴다. URL을 파일마다 하드코딩하면 도메인이 바뀌거나 키 이름을 바꿀 때 여러 파일을 다 고쳐야 해서, 한 군데로 모았다.

## 데이터 불러오기

페이지에서 `useState`로 상태 만들고, `useEffect`에서 API 부르고, `.then`으로 넣고 `.catch`로 에러 표시. 브리핑은 API가 3개라 이 세트가 3번 들어간다.

즐겨찾기에서 저장한 출발역은 localStorage에 넣고, 브리핑이 그걸 읽어서 지하철 조회에 쓴다. (두 페이지가 동시에 안 떠서 이걸로 충분. 나중에 실시간 공유가 필요해지면 그때 Context.)

# 붙이면서 걸린 것

API 3개 다 붙였다. 실제로 걸렸던 것들:

- **인증키 이중 인코딩** — 공공데이터포털이 키를 두 종류(Encoding/Decoding) 준다. Decoding 키를 그대로 넣고 인코딩은 한 번만. 두 번 되면 키 미등록 에러.
- **기상청 응답이 흩어져 옴** — 기온, 강수확률이 한 덩어리로 안 오고 시간별 행으로 쭉 온다. 오늘 날짜만 골라서 다시 조립.
- **지하철은 성공해도 응답 키가 `errorMessage`** — 안의 `code`가 `INFO-000`이면 정상. 이름 보고 실패로 착각하면 안 됨.
- **지하철 API는 http만 됨** — 로컬은 되는데 나중에 https로 배포하면 막힌다.
- **새벽엔 지하철이 빈 응답** — 운행 끝나면 도착 목록이 0건. "도착 예정 열차 없음"으로 표시(정상).

## 일부러 안 한 것

- **도착역은 저장만, 경로 계산 X** — 지하철 API로는 출발→도착 경로를 못 구한다(역별 도착만 준다). STEP1 밖.
- **날씨/미세먼지 지역 고정(광진구)** — 즐겨찾기로 지역까지 바꾸려면 좌표 변환·측정소 매핑이 필요. STEP1 밖.
- **공용 데이터 훅 안 씀** — 처음엔 `useAsync` 훅으로 묶었다가, 읽기 쉬우라고 페이지 안에 `useState`+`useEffect`로 풀었다.
