import { FC, useCallback, useContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useAtom } from "@reatom/react";
import { matrixAtom, PixelAtom } from "../store/matrixAtom";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";
import Matrix from "../../../components/Matrix/Matrix";

const Pixel: FC<{
  atom: PixelAtom;
}> = ({ atom }) => {
  const [{ backgroundColor }] = useAtom(atom);

  return <div style={{ width: 1, height: 1, backgroundColor }} />;
};
export const MatrixReatom: FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const [matrix, { setValue: setMatrix, updatePixel }] = useAtom(matrixAtom);
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
        updatePixel(value);
        endMark();
      },
    }),
    [endMark, setMatrix, startMark, updatePixel]
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
        row.map((atom, columnIdx) => (
          <Pixel key={`row=${rowIdx}-column=${columnIdx}`} atom={atom} />
        ))
      )}
    </Matrix>
  );
};
