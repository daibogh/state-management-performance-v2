import { reatomStore } from "../store";
import React from "react";
import { reatomContext } from "@reatom/react";
export const ReatomProvider: React.FC = ({ children }) => (
  <reatomContext.Provider value={reatomStore}>
    {children}
  </reatomContext.Provider>
);
