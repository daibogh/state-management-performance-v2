import { useCallback, useMemo } from "react";
export type StartMarkFunction = () => void;
export type EndMarkFunction = () => void;
export type CollectPerformanceFunction = () => PerformanceEntryList;
export const usePerformanceMeasure = ({
  startMark,
  endMark,
  measureMark,
}: {
  startMark: string;
  endMark: string;
  measureMark: string;
}): {
  startMark: StartMarkFunction;
  endMark: EndMarkFunction;
  collectPerformanceList: CollectPerformanceFunction;
} => {
  const startMarkFn = useCallback(() => {
    performance.mark(startMark);
  }, [startMark]);
  const endMarkFn = useCallback(() => {
    performance.mark(endMark);
    try {
      performance.measure(measureMark, startMark, endMark);
    } catch (e) {
      console.error(e);
    }
  }, [endMark, measureMark, startMark]);
  const collectPerformanceList = useCallback(
    () => performance.getEntriesByName(measureMark),
    [measureMark]
  );
  return useMemo(
    () => ({
      startMark: startMarkFn,
      endMark: endMarkFn,
      collectPerformanceList,
    }),
    [collectPerformanceList, endMarkFn, startMarkFn]
  );
};
