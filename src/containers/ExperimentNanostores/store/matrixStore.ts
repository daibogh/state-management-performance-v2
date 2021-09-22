import { createStore, getValue, update } from "nanostores";
export const getPixelStore = (props: { backgroundColor: string }) => {
  const store = createStore<{ backgroundColor: string }>(() => {
    store.set(props);
  });
  return store;
};
export type MatrixElem = ReturnType<typeof getPixelStore>;
export const matrixStore = createStore<MatrixElem[][]>(() => {
  matrixStore.set([]);
});

export function setMatrix({
  size,
  backgroundColor,
}: {
  size: number;
  backgroundColor: string;
}) {
  update(matrixStore, () =>
    new Array(size).fill(null).map((_, rowIdx) =>
      new Array(size).fill(null).map((_, columnIdx) =>
        getPixelStore({
          backgroundColor,
        })
      )
    )
  );
}
export const updateMatrix = ({
  backgroundColor,
  position: [row, col],
}: {
  backgroundColor: string;
  position: [number, number];
}) => {
  update(getValue(matrixStore)[row][col], () => ({ backgroundColor }));
};
