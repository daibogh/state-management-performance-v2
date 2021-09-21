import { createEvent, createStore } from "effector";

export const setMatrix$ =
  createEvent<{ backgroundColor: string; size: number }>("setMatrixValue");
export const updateMatrix$ =
  createEvent<{ position: [number, number]; backgroundColor: string }>(
    "setMatrixValue"
  );
const getPixelAction = (id: string) =>
  createEvent<{ backgroundColor: string }>(`updatePixel#${id}`);
const getPixelStore = (
  id: string,
  initialValue: { backgroundColor: string }
) => {
  const update$ = getPixelAction(id);
  const pixel = createStore(initialValue).on(update$, (_, value) => value);
  return { update: update$, pixel };
};
export type MatrixElem = ReturnType<typeof getPixelStore>;
export const $matrixStore = createStore<MatrixElem[][]>([])
  .on(setMatrix$, (_, { backgroundColor, size }) =>
    new Array(size)
      .fill(null)
      .map((_, rowIdx) =>
        new Array(size)
          .fill(null)
          .map((_, columnIdx) =>
            getPixelStore(`row#${rowIdx};col${columnIdx}`, { backgroundColor })
          )
      )
  )
  .on(updateMatrix$, (state, payload) => {
    state[payload.position[0]][payload.position[1]].update(payload);
  });
