import { Socket } from "socket.io-client";
import React, { FC, useCallback, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";
import { Matrix } from "../../../components/Matrix";
const Pixel = observer<{ rowIdx: number; columnIdx: number }>(
  ({ rowIdx, columnIdx }) => {
    const {
      matrix: {
        value: {
          [rowIdx]: { [columnIdx]: elem },
        },
      },
    } = useContext(StoreContext);
    return (
      <div
        style={{
          width: 1,
          height: 1,
          backgroundColor: elem.backgroundColor,
        }}
      />
    );
  }
);
export const MatrixMobx: FC = observer(() => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const {
    matrix: { value: matrix, setMatrix, update: updateMatrix },
  } = useContext(StoreContext);

  const measureProps = useMemo(
    () => ({
      startMark: "mobx:matrix:update--start",
      endMark: "mobx:matrix:update--end",
      measureMark: "mobx:matrix:re-render",
    }),
    []
  );
  const { startMark, endMark, collectPerformanceList } =
    useMeasureMarks(measureProps);
  const size = useCollectionSize();
  const onOpenSocket = useCallback(
    (socket: Socket) => {
      socket.emit("matrix:get", size);
    },
    [size]
  );
  const listeners = useMemo(
    () => ({
      "matrix:value": ([backgroundColor, size]: [string, number]) => {
        setMatrix(
          new Array(size).fill(null).map((e, i) => {
            return new Array(size).fill(null).map(() => {
              return {
                backgroundColor, //genColor(),
              };
            });
          })
        );
      },
      "matrix:update": (value: {
        position: [number, number];
        backgroundColor: string;
      }) => {
        startMark();
        updateMatrix(value);
        endMark();
      },
    }),
    [endMark, setMatrix, startMark, updateMatrix]
  );
  const onCloseSocket = useCallback(() => {
    const res = collectPerformanceList();
    setMeasure(res);
  }, [collectPerformanceList, setMeasure]);
  useConfigureExperiment({
    socketCallbacks: {
      onOpen: onOpenSocket,
      onClose: onCloseSocket,
      listeners,
    },
  });
  return (
    <Matrix>
      {matrix.map((row, rowIdx) =>
        row.map((elem, columnIdx) => (
          <Pixel
            key={`row=${rowIdx}-column=${columnIdx}`}
            rowIdx={rowIdx}
            columnIdx={columnIdx}
          />
        ))
      )}
    </Matrix>
  );
});
