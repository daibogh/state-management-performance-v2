import React, { useCallback, useContext, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Socket } from "socket.io-client";
import { setMatrix, updateMatrix } from "../store/slices/matrixSlice";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { Matrix } from "../../../components/Matrix";
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";

export const MatrixRedux: React.FC = () => {
  const setMeasure = useContext(MeasureResultContext).perfTempState[1];
  const matrix = useAppSelector((store) => store.matrix.value);
  const dispatch = useAppDispatch();
  const measureProps = useMemo(
    () => ({
      startMark: "redux:matrix:update--start",
      endMark: "redux:matrix:update--end",
      measureMark: "redux:matrix:re-render",
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
        dispatch(
          setMatrix(
            new Array(size).fill(null).map((e, i) => {
              return new Array(size).fill(null).map(() => {
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
