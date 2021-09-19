import { createStore, createEvent } from "effector";

export const setList =
  createEvent<{ width: number; backgroundColor: string }[]>("setList");
export const updateList = createEvent<[number]>("updateList");
export const $listStore = createStore<
  { width: number; backgroundColor: string }[]
>([])
  .on(setList, (_, payload) => payload)
  .on(updateList, (state, [_idx]) =>
    state.map((props, idx) =>
      idx === _idx ? { ...props, width: props.width + 5 } : props
    )
  );
