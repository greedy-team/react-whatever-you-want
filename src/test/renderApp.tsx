import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { SettingsProvider } from "../context/SettingsContext.tsx";
import App from "../App.tsx";
import HomePage from "../pages/HomePage.tsx";
import PlayPage from "../pages/PlayPage.tsx";
import ResultPage from "../pages/ResultPage.tsx";
import StationsPage from "../pages/StationsPage.tsx";
import NotFoundPage from "../pages/NotFoundPage.tsx";

export function renderApp(initialPath = "/") {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="play" element={<PlayPage />} />
            <Route path="result" element={<ResultPage />} />
            <Route path="stations" element={<StationsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </SettingsProvider>,
  );
}
