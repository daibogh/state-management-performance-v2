import { createAtom } from "@reatom/core";

type ListItem = { width: number; backgroundColor: string };
export const listAtom = createAtom(
  { setList: (list: ListItem[]) => list, updateList: ([idx]: number[]) => idx },
  ({ onAction }, list: ListItem[] = []) => {
    onAction("setList", (value) => {
      list = value;
    });
    onAction("updateList", (idx) => {
      list[idx].width += 5;
    });
    return [...list];
  }
);
