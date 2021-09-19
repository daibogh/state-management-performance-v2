import React, { useCallback, useContext, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { setList, updateList } from "../store/slices/listSlice";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { List } from "../../../components/List";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";

export const ListRedux: React.FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const items = useAppSelector((store) => store.list.value);
  const dispatch = useAppDispatch();
  const { startMark, endMark, collectPerformanceList } = usePerformanceMeasure({
    startMark: "list:update--start",
    endMark: "list:update--end",
    measureMark: "list:re-render",
  });
  const onOpenSocket = useCallback((socket: Socket) => {
    socket.emit("list:get");
  }, []);
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
