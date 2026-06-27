import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChartArea } from "../components/ChartArea";

const mockUseCandles = vi.hoisted(() => vi.fn());

vi.mock("../hooks/useCandles", () => ({
  useCandles: mockUseCandles,
}));

vi.mock("lightweight-charts", () => ({
  createChart: vi.fn(() => ({
    addSeries: vi.fn(() => ({ setData: vi.fn(), update: vi.fn() })),
    timeScale: vi.fn(() => ({ fitContent: vi.fn() })),
    remove: vi.fn(),
  })),
  CandlestickSeries: {},
  ColorType: { Solid: "solid" },
}));

vi.mock("@/store/marketStore", () => ({
  useMarketStore: vi.fn(() => null),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseCandles.mockReturnValue({ data: [], isLoading: false, isError: false });
});

describe("ChartArea", () => {
  it("renders 1H and 1D tabs", () => {
    render(<ChartArea />);
    expect(screen.getByRole("tab", { name: "1H" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "1D" })).toBeDefined();
  });

  it("selects 1H by default", () => {
    render(<ChartArea />);
    expect(screen.getByRole("tab", { name: "1H" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "1D" }).getAttribute("aria-selected")).toBe("false");
  });

  it("switches active tab to 1D on click", () => {
    render(<ChartArea />);
    fireEvent.click(screen.getByRole("tab", { name: "1D" }));
    expect(screen.getByRole("tab", { name: "1D" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "1H" }).getAttribute("aria-selected")).toBe("false");
  });

  it("passes interval=60 to useCandles when 1H is active", () => {
    render(<ChartArea />);
    expect(mockUseCandles).toHaveBeenCalledWith(60);
  });

  it("passes interval=1440 to useCandles after switching to 1D", () => {
    render(<ChartArea />);
    fireEvent.click(screen.getByRole("tab", { name: "1D" }));
    expect(mockUseCandles).toHaveBeenCalledWith(1440);
  });

  it("wraps tabs in a tablist with accessible label", () => {
    render(<ChartArea />);
    expect(screen.getByRole("tablist", { name: "Candle interval" })).toBeDefined();
  });
});
