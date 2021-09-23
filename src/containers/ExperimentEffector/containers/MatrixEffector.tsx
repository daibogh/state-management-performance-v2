import { FC, useCallback, useContext, useMemo } from "react";
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
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";
import { Matrix } from "../../../components/Matrix";

const Pixel: FC<{
  store: MatrixElem;
}> = ({ store: { pixel } }) => {
  const { backgroundColor } = useStore(pixel);

  return <div style={{ width: 1, height: 1, backgroundColor }} />;
};
export const MatrixEffector: FC = () => {
  const setMeasure = useContext(MeasureResultContext).perfTempState[1];
  const matrix = useStore($matrixStore);

  const measureProps = useMemo(
    () => ({
      startMark: "effector:matrix:update--start",
      endMark: "effector:matrix:update--end",
      measureMark: "effector:matrix:re-render",
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
      "matrix:value": ([value, size]: [string, number]) => {
        setMatrix$({ backgroundColor: value, size });
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
    <Matrix>
      {matrix.map((row, rowIdx) =>
        row.map((store, columnIdx) => (
          <Pixel key={`row=${rowIdx}-column=${columnIdx}`} store={store} />
        ))
      )}
    </Matrix>
  );
};
