import { FC, useCallback, useContext, useMemo } from "react";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import {
  $matrixStore,
  MatrixElem,
  setMatrix$,
  updateMatrix$,
} from "../store/matrixStore";
import { useStore } from "effector-react";

const Pixel: FC<{
  store: MatrixElem;
}> = ({ store: { update, pixel } }) => {
  const { backgroundColor } = useStore(pixel);

  return <div style={{ width: 1, height: 1, backgroundColor }} />;
};
export const MatrixEffector: FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const matrix = useStore($matrixStore);
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
        setMatrix$({ backgroundColor: value });
      },
      "matrix:update": (value: {
        position: [number, number];
        backgroundColor: string;
      }) => {
        startMark();
        updateMatrix$(value);
        endMark();
      },
    }),
    [endMark, startMark]
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
          row.map((store, columnIdx) => (
            <Pixel key={`row=${rowIdx}-column=${columnIdx}`} store={store} />
          ))
        )}
      </div>
    </div>
  );
};
