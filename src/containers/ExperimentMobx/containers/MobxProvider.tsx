import { RootStore, StoreContext } from "../store";
import React from "react";
const rootStore = new RootStore();
export const MobxProvider: React.FC = ({ children }) => (
  <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
);
