import React, { createContext, useMemo, useState } from "react";
export type PerfType = {
  readonly duration: DOMHighResTimeStamp;
  readonly entryType: string;
  readonly name: string;
  readonly startTime: DOMHighResTimeStamp;
  readonly uid: string;
  readonly fill: string;
};
export const MeasureResultContext = createContext<{
  perfTempState: [PerformanceEntryList, (value: PerformanceEntryList) => void];
  perfBufferState: [PerfType[], (value: PerfType[]) => void];
}>({ perfTempState: [[], () => {}], perfBufferState: [[], () => {}] });

export const MeasureResultProvider: React.FC = ({ children }) => {
  const perfTempState = useState<PerformanceEntryList>([]);
  const perfBufferState = useState<PerfType[]>([]);
  const value = useMemo(
    () => ({ perfTempState, perfBufferState }),
    [perfBufferState, perfTempState]
  );
  return (
    <MeasureResultContext.Provider value={value}>
      {children}
    </MeasureResultContext.Provider>
  );
};
