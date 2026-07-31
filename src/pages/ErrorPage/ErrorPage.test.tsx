import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Layout from "../../components/Layout/Layout";
import ErrorPage from "./ErrorPage";

// useRouteError 동작 모킹
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useRouteError: () => ({
      status: 404,
      statusText: "Not Found",
    }),
    isRouteErrorResponse: () => true,
  };
});

describe("라우팅 에러 핸들링 테스트", () => {
  it("존재하지 않는 경로 접근 시 Layout 내부에서 404 에러 페이지가 렌더링된다", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              path: "*",
              element: <ErrorPage />,
            },
          ],
        },
      ],
      {
        initialEntries: ["/invalid-path"],
      },
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/404 Page Not Found/i)).toBeInTheDocument();
  });
});
