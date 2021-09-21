import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  backgroundOperation,
  setList,
  startWithBackground,
  updateList,
} from "../store/slices/listSlice";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { List } from "../../../components/List";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useMeasureMarks } from "use-measure-marks";
import {
  useCollectionSize,
  useIsBackgroundOperation,
} from "../../../hooks/useRouteParams";

export const ListRedux: React.FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const items = useAppSelector((store) => store.list.value);
  const dispatch = useAppDispatch();
  const { startMark, endMark, collectPerformanceList } = useMeasureMarks({
    startMark: "list:update--start",
    endMark: "list:update--end",
    measureMark: "list:re-render",
  });
  const size = useCollectionSize();
  const isBackgroundOp = useIsBackgroundOperation();
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBackgroundOp) {
      dispatch(startWithBackground());
      timer = setInterval(() => {
        dispatch(backgroundOperation());
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [dispatch, isBackgroundOp]);
  const onOpenSocket = useCallback(
    (socket: Socket) => {
      socket.emit("list:get", size);
    },
    [size]
  );
  const listeners = useMemo(
    () => ({
      "list:value": (value: number[]) => {
        dispatch(
          setList(
            value.map((item) => ({
              backgroundColor: `rgb(${Math.floor(
                Math.random() * 255
              )},${Math.floor(Math.random() * 255)},${Math.floor(
                Math.random() * 255
              )})`,
              width: item,
            }))
          )
        );
      },
      "list:update": (value: [number]) => {
        startMark();
        dispatch(updateList(value));
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
  return (
    <div>
      <List items={items} />
    </div>
  );
};
