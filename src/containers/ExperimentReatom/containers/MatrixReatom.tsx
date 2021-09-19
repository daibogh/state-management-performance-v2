import { FC, useCallback, useContext, useMemo } from "react";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { useAtom } from "@reatom/react";
import { matrixAtom, PixelAtom } from "../store/matrixAtom";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";

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
    usePerformanceMeasure(measureProps);
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
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${matrix.length}, 1px)`,
        }}
      >
        {matrix.map((row, rowIdx) =>
          row.map((atom, columnIdx) => (
            <Pixel key={`row=${rowIdx}-column=${columnIdx}`} atom={atom} />
          ))
        )}
      </div>
    </div>
  );
};
