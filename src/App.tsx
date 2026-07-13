import { NavLink, Outlet } from "react-router";

function App() {
  return (
    <>
      <header>
        <h1>NagaDo</h1>
        <nav aria-label="주요 메뉴">
          <NavLink to="/">브리핑</NavLink>
          <NavLink to="/favorites">즐겨찾기</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
