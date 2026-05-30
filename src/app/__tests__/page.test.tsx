import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "../page";

describe("HomePage", () => {
  it("renders the FinPulse app title", () => {
    render(<HomePage />);
    const title = screen.getByTestId("app-title");
    expect(title).toBeDefined();
    expect(title.textContent).toBe("FinPulse");
  });

  it("renders the subtitle", () => {
    render(<HomePage />);
    expect(screen.getByText("Real-time market intelligence")).toBeDefined();
  });

  it("renders the BTC/USD live feed placeholder", () => {
    render(<HomePage />);
    expect(screen.getByText("BTC/USD live feed coming soon")).toBeDefined();
  });
});
