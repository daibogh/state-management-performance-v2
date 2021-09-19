import { FC, memo, useCallback, useContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useMatrixRef, useMatrixState } from "../store/matrixHooks";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { useMeasureMarks } from "use-measure-marks";

const Pixel: FC<{
  backgroundColor: string;
}> = memo(({ backgroundColor }) => {
  return <div style={{ width: 1, height: 1, backgroundColor }} />;
});
export const MatrixHooks: FC<{ isRef?: boolean }> = ({ isRef }) => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const matrixState = useMatrixState();
  const matrixRef = useMatrixRef();
  const { matrix, setMatrix, updateMatrix } = useMemo(
    () => (isRef ? matrixRef : matrixState),
    [isRef, matrixRef, matrixState]
  );
  const measureProps = useMemo(
    () => ({
      startMark: "matrix:update--start",
      endMark: "matrix:update--end",
      measureMark: "matrix:re-render",
    }),
    []
  );
  const { startMark, endMark, collectPerformanceList } =
    useMeasureMarks(measureProps);
  const onOpenSocket = useCallback((socket: Socket) => {
    socket.emit("matrix:get");
  }, []);
  const listeners = useMemo(
    () => ({
      "matrix:value": (value: string) => {
        setMatrix(value);
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
          row.map(({ backgroundColor }, columnIdx) => (
            <Pixel
              key={`row=${rowIdx}-column=${columnIdx}`}
              backgroundColor={backgroundColor}
            />
          ))
        )}
      </div>
    </div>
  );
};
