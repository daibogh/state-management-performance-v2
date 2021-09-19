import { createContext, FC } from "react";

const ExperimentHooksContext = createContext<{}>({});

export const ExperimentProvider: FC = ({ children }) => {
  return (
    <ExperimentHooksContext.Provider value={{}}>
      {children}
    </ExperimentHooksContext.Provider>
  );
};
