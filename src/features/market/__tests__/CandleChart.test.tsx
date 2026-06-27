import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CandleChart } from "../components/CandleChart";
import { useMarketStore } from "@/store/marketStore";

const mockUpdate = vi.hoisted(() => vi.fn());
const mockSetData = vi.hoisted(() => vi.fn());

vi.mock("lightweight-charts", () => ({
  createChart: vi.fn(() => ({
    addSeries: vi.fn(() => ({
      setData: mockSetData,
      update: mockUpdate,
    })),
    timeScale: vi.fn(() => ({ fitContent: vi.fn() })),
    remove: vi.fn(),
  })),
  CandlestickSeries: {},
  ColorType: { Solid: "solid" },
}));

vi.mock("../hooks/useCandles");

import { useCandles } from "../hooks/useCandles";

const mockUseCandles = vi.mocked(useCandles);

const INITIAL_STORE_STATE = {
  lastPrice: null,
  lastTickerMessageAt: null,
};

describe("CandleChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMarketStore.setState(INITIAL_STORE_STATE);
  });

  it("shows loading overlay while fetching", () => {
    mockUseCandles.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);
    expect(screen.getByText("Loading chart data…")).toBeDefined();
  });

  it("shows error overlay when fetch fails", () => {
    mockUseCandles.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);
    expect(screen.getByText("Failed to load chart data. Please try again.")).toBeDefined();
  });

  it("renders the chart container when data is available", () => {
    mockUseCandles.mockReturnValue({
      data: [{ time: 1700000000, open: 67000, high: 68000, low: 66000, close: 67500 }],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);
    expect(screen.getByTestId("candle-chart")).toBeDefined();
  });

  it("shows no overlay when data is available", () => {
    mockUseCandles.mockReturnValue({
      data: [{ time: 1700000000, open: 67000, high: 68000, low: 66000, close: 67500 }],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);
    expect(screen.queryByText("Loading chart data…")).toBeNull();
    expect(screen.queryByText("Failed to load chart data. Please try again.")).toBeNull();
  });

  it("passes the interval to useCandles", () => {
    mockUseCandles.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={1440} />);
    expect(mockUseCandles).toHaveBeenCalledWith(1440);
  });

  it("calls series.update when a live tick arrives", () => {
    mockUseCandles.mockReturnValue({
      data: [{ time: 1700000000, open: 67000, high: 68000, low: 66000, close: 67500 }],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);

    act(() => {
      useMarketStore.setState({ lastPrice: 68000, lastTickerMessageAt: Date.now() });
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ open: 68000, close: 68000 }),
    );
  });

  it("repopulates series from cache when switching back to a previously loaded interval", () => {
    const candles = [{ time: 1700000000, open: 67000, high: 68000, low: 66000, close: 67500 }];

    mockUseCandles.mockReturnValue({
      data: candles,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    const { rerender } = render(<CandleChart interval={60} />);

    // Switch to 1D with no cached data (loading)
    mockUseCandles.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);
    rerender(<CandleChart interval={1440} />);

    mockSetData.mockClear();

    // Switch back to 1H — same candle array returned from cache
    mockUseCandles.mockReturnValue({
      data: candles,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);
    rerender(<CandleChart interval={60} />);

    expect(mockSetData).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ time: 1700000000 })]),
    );
  });

  it("clears series when switching to an interval with no cached data", () => {
    mockUseCandles.mockReturnValue({
      data: [{ time: 1700000000, open: 67000, high: 68000, low: 66000, close: 67500 }],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    const { rerender } = render(<CandleChart interval={60} />);
    mockSetData.mockClear();

    mockUseCandles.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);
    rerender(<CandleChart interval={1440} />);

    expect(mockSetData).toHaveBeenCalledWith([]);
  });

  it("tracks running high and low across ticks in the same candle period", () => {
    mockUseCandles.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useCandles>);

    render(<CandleChart interval={60} />);

    const periodStart = Math.floor(Date.now() / 1000 / 3600) * 3600 * 1000;

    act(() => {
      useMarketStore.setState({ lastPrice: 67000, lastTickerMessageAt: periodStart });
    });
    act(() => {
      useMarketStore.setState({ lastPrice: 69000, lastTickerMessageAt: periodStart + 1000 });
    });
    act(() => {
      useMarketStore.setState({ lastPrice: 66000, lastTickerMessageAt: periodStart + 2000 });
    });

    expect(mockUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({ open: 67000, high: 69000, low: 66000, close: 66000 }),
    );
  });
});
