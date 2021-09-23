import { FC, memo, useCallback, useContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useMatrixRef, useMatrixState } from "../store/matrixHooks";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";
import { Matrix } from "../../../components/Matrix";

const Pixel: FC<{
  backgroundColor: string;
}> = memo(({ backgroundColor }) => {
  return <div style={{ width: 1, height: 1, backgroundColor }} />;
});
export const MatrixHooks: FC<{ isRef?: boolean }> = ({ isRef }) => {
  const setMeasure = useContext(MeasureResultContext).perfTempState[1];
  const matrixState = useMatrixState();
  const matrixRef = useMatrixRef();
  const { matrix, setMatrix, updateMatrix } = useMemo(
    () => (isRef ? matrixRef : matrixState),
    [isRef, matrixRef, matrixState]
  );
  const measureProps = useMemo(
    () => ({
      startMark: `${isRef ? "react_ref" : "react_state"}:matrix:update--start`,
      endMark: `${isRef ? "react_ref" : "react_state"}:matrix:update--end`,
      measureMark: `${isRef ? "react_ref" : "react_state"}:matrix:re-render`,
    }),
    [isRef]
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
      "matrix:value": (props: [string, number]) => {
        setMatrix(props);
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
        row.map(({ backgroundColor }, columnIdx) => (
          <Pixel
            key={`row=${rowIdx}-column=${columnIdx}`}
            backgroundColor={backgroundColor}
          />
        ))
      )}
    </Matrix>
  );
};
