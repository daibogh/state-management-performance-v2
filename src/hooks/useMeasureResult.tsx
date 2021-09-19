import React, { createContext, useState } from "react";

export const MeasureResultContext = createContext<
  [PerformanceEntryList, (value: PerformanceEntryList) => void]
>([[], () => {}]);

export const MeasureResultProvider: React.FC = ({ children }) => {
  const stateProps = useState<PerformanceEntryList>([]);
  return (
    <MeasureResultContext.Provider value={stateProps}>
      {children}
    </MeasureResultContext.Provider>
  );
};
