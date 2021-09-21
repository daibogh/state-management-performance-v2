import { useCallback, useMemo, useRef, useState } from "react";
import { useBoolean } from "react-use";

export const useMatrixState = () => {
  const [matrix, _setMatrix] = useState<{ backgroundColor: string }[][]>([]);
  const setMatrix = useCallback(
    ([backgroundColor, size]: [string, number]) =>
      _setMatrix(
        new Array(size)
          .fill(null)
          .map(() =>
            new Array(size).fill(null).map(() => ({ backgroundColor }))
          )
      ),
    []
  );
  const updateMatrix = useCallback(
    ({
      position: [rowIdx, columnIdx],
      backgroundColor,
    }: {
      position: [number, number];
      backgroundColor: string;
    }) => {
      _setMatrix((matrix) =>
        matrix.map((row, _rowIdx) =>
          rowIdx !== _rowIdx
            ? row
            : row.map((col, _colIdx) =>
                columnIdx !== _colIdx ? col : { backgroundColor }
              )
        )
      );
    },
    []
  );
  return useMemo(
    () => ({ matrix, setMatrix, updateMatrix }),
    [matrix, setMatrix, updateMatrix]
  );
};

export const useMatrixRef = () => {
  const matrix = useRef<{ backgroundColor: string }[][]>([]);
  const [_, forceRender] = useBoolean(false);
  const setMatrix = useCallback(
    ([backgroundColor, size]: [string, number]) => {
      matrix.current = new Array(size)
        .fill(null)
        .map(() => new Array(size).fill(null).map(() => ({ backgroundColor })));
      forceRender();
    },
    [forceRender]
  );
  const updateMatrix = useCallback(
    ({
      position: [rowIdx, columnIdx],
      backgroundColor,
    }: {
      position: [number, number];
      backgroundColor: string;
    }) => {
      matrix.current[rowIdx][columnIdx].backgroundColor = backgroundColor;
      forceRender();
    },
    [forceRender]
  );
  return useMemo(
    () => ({ matrix: matrix.current, setMatrix, updateMatrix, _ }),
    [_, setMatrix, updateMatrix]
  );
};
