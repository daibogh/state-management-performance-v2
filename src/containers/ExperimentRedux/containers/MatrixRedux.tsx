import React, { useCallback, useContext, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { setMatrix, updateMatrix } from "../store/slices/matrixSlice";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { Matrix } from "../../../components/Matrix";

export const MatrixRedux: React.FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const matrix = useAppSelector((store) => store.matrix.value);
  const dispatch = useAppDispatch();
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
        dispatch(
          setMatrix(
            new Array(100).fill(null).map((e, i) => {
              return new Array(100).fill(null).map(() => {
                return {
                  backgroundColor: value, //genColor(),
                };
              });
            })
          )
        );
      },
      "matrix:update": (value: {
        position: [number, number];
        backgroundColor: string;
      }) => {
        startMark();
        dispatch(updateMatrix(value));
        endMark();
      },
    }),
    [dispatch, endMark, startMark]
  );
  const onCloseSocket = useCallback(() => {
    const res = collectPerformanceList();
    console.log(res);
    setMeasure(res);
  }, [collectPerformanceList, setMeasure]);
  useConfigureExperiment({
    socketCallbacks: {
      onOpen: onOpenSocket,
      onClose: onCloseSocket,
      listeners,
    },
  });
  return <Matrix matrix={matrix} />;
};
