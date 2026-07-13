import { NavLink } from "react-router";

export function AppNavigator() {
  return (
    <div>
      <h1>NAV</h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              Search
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/list"
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              List
            </NavLink>
          </li>
        </ul>
      </nav>
      <style>{`
        .nav-active {
          color: orange;
        }
      `}</style>
    </div>
  );
}
