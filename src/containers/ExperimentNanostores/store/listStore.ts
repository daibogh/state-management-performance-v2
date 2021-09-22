import { createStore, update } from "nanostores";
import { BIG_COLLECTION } from "../../../constants/collections";

export const listStore = createStore<
  {
    backgroundColor: string;
    width: number;
  }[]
>(() => {
  listStore.set([]);
});
export function updateList([_idx]: [number]) {
  update(listStore, (state) =>
    state.map((props, idx) =>
      idx === _idx ? { ...props, width: props.width + 5 } : props
    )
  );
}
export function setList(props: { width: number; backgroundColor: string }[]) {
  update(listStore, () => props);
}

export const otherListStore = createStore<number[]>(() => {
  otherListStore.set([]);
});

export function startWithBackground() {
  update(otherListStore, () => BIG_COLLECTION);
}
export function backgroundAction() {
  update(otherListStore, (current) => [...current, 0]);
}
