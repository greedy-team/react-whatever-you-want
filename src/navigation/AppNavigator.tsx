import { Link } from "react-router";

export function AppNavigator() {
  return (
    <div>
      <h1>NAV</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Search</Link>
          </li>
          <li>
            <Link to="/list">List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
