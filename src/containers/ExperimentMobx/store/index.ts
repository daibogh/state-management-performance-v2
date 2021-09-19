import { MatrixStore } from "./MatrixStore";
import { ListStore } from "./ListStore";
import { makeObservable, observable } from "mobx";
import { createContext } from "react";
export class RootStore {
  list = {} as ListStore;
  matrix = {} as MatrixStore;
  constructor() {
    makeObservable(this, {
      list: observable.ref,
    });
    this.list = new ListStore();
    this.matrix = new MatrixStore();
  }
}
export const StoreContext = createContext<RootStore>({} as RootStore);
