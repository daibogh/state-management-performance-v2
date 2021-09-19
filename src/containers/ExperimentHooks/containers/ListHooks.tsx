import { FC, useCallback, useContext, useMemo } from "react";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { List } from "../../../components/List";
import { useListRef, useListState } from "../store/listHooks";

export const ListHooks: FC<{ isRef?: boolean }> = ({ isRef }) => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const listState = useListState();
  const listRef = useListRef();
  const { updateList, setList, list } = useMemo(() => {
    if (isRef) {
      return listRef;
    } else return listState;
  }, [isRef, listRef, listState]);
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
        setList(
          value.map((item) => ({
            backgroundColor: `rgb(${Math.floor(
              Math.random() * 255
            )},${Math.floor(Math.random() * 255)},${Math.floor(
              Math.random() * 255
            )})`,
            width: item,
          }))
        );
      },
      "list:update": (value: [number]) => {
        console.log("here");
        startMark();
        updateList(value);
        endMark();
      },
    }),
    [endMark, setList, startMark, updateList]
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
  return <List items={list} />;
};