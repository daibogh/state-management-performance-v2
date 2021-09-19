import { Socket } from "socket.io-client";
import React, { FC, useCallback, useContext, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
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
      startMark: "matrix:update--start",
      endMark: "matrix:update--end",
      measureMark: "matrix:re-render",
    }),
    []
  );
  const { startMark, endMark, collectPerformanceList } =
    usePerformanceMeasure(measureProps);
  const onOpenSocket = useCallback((socket: Socket) => {
    socket.emit("matrix:get");
  }, []);
  const listeners = useMemo(
    () => ({
      "matrix:value": (value: string) => {
        setMatrix(
          new Array(100).fill(null).map((e, i) => {
            return new Array(100).fill(null).map(() => {
              return {
                backgroundColor: value, //genColor(),
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
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrix.length}, 1px)`,
        }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((elem, columnIdx) => (
            <Pixel
              key={`row=${rowIdx}-column=${columnIdx}`}
              rowIdx={rowIdx}
              columnIdx={columnIdx}
            />
          ))
        )}
      </div>
    </div>
  );
});
