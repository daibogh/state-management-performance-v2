import { createAtom } from "@reatom/core";
import { BIG_COLLECTION } from "../../../constants/collections";

type ListItem = { width: number; backgroundColor: string };
export const listAtom = createAtom(
  { setList: (list: ListItem[]) => list, updateList: ([idx]: number[]) => idx },
  ({ onAction }, list: ListItem[] = []) => {
    onAction("setList", (value) => {
      list = value;
    });
    onAction("updateList", (idx) => {
      list[idx] = { ...list[idx], width: list[idx].width + 5 };
      return list;
    });
    return [...list];
  }
);
export const otherAtom = createAtom(
  { backgroundOperation: () => {}, startWithBackground: () => {} },
  ({ onAction }, list: number[] = []) => {
    onAction("startWithBackground", () => {
      list = BIG_COLLECTION;
    });
    onAction("backgroundOperation", () => {
      list = list.concat([0]);
    });
    return [...list];
  }
);
