import { makeAutoObservable } from "mobx";
import { BIG_COLLECTION } from "../../../constants/collections";
export class ListStore {
  value = [] as { width: number; backgroundColor: string }[];
  otherList = [] as number[];
  constructor() {
    makeAutoObservable(this);
  }
  setList = (value: this["value"]) => {
    this.value = value;
  };
  updateList = (value: [number]) => {
    const [index] = value;
    if (this.value[index].width < 100) this.value[index].width += 5;
  };
  startWithBackground = () => (this.otherList = BIG_COLLECTION);
  backgroundOperation = () => this.otherList.push(0);
}
