import { createAtom } from "@reatom/core";

function createPixelAtom(value: string) {
  return createAtom(
    { update: (value: string) => value },
    ({ onAction }, pixel = value) => {
      onAction("update", (value) => {
        pixel = value;
      });
      return pixel;
    }
  );
}
export type PixelAtom = ReturnType<typeof createPixelAtom>;
export const matrixAtom = createAtom(
  {
    setValue: (value: string) =>
      new Array(100).fill(
        new Array(100).fill(null).map(() => createPixelAtom(value))
      ) as PixelAtom[][],
    updatePixel: (value: {
      position: [number, number];
      backgroundColor: string;
    }) => value,
  },
  ({ onAction }, matrix: PixelAtom[][] = []) => {
    onAction("setValue", (value) => (matrix = value));
    onAction("updatePixel", ({ backgroundColor, position: [row, col] }) => {
      matrix[row][col].update(backgroundColor);

      return matrix;
    });
    return matrix;
  }
);
