import { FC, useCallback, useContext, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { List } from "../../../components/List";
import {
  useListRef,
  useListState,
  useOtherListRef,
  useOtherListState,
} from "../store/listHooks";
import { useMeasureMarks } from "use-measure-marks";
import { useCollectionSize } from "../../../hooks/useRouteParams";

export const ListHooks: FC<{ isRef?: boolean }> = ({ isRef }) => {
  const setMeasure = useContext(MeasureResultContext).perfTempState[1];
  const listState = useListState();
  const listRef = useListRef();
  const useBackgroundHooks = isRef ? useOtherListRef : useOtherListState;
  useBackgroundHooks();
  const { updateList, setList, list } = useMemo(() => {
    if (isRef) {
      return listRef;
    } else return listState;
  }, [isRef, listRef, listState]);
  const { startMark, endMark, collectPerformanceList } = useMeasureMarks({
    startMark: `${isRef ? "react_ref" : "react_state"}:list:update--start`,
    endMark: `${isRef ? "react_ref" : "react_state"}:list:update--end`,
    measureMark: `${isRef ? "react_ref" : "react_state"}:list:re-render`,
  });
  const size = useCollectionSize();
  const onOpenSocket = useCallback(
    (socket: Socket) => {
      socket.emit("list:get", size);
    },
    [size]
  );
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
        startMark();
        updateList(value);
        endMark();
      },
    }),
    [endMark, setList, startMark, updateList]
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
  return <List items={list} />;
};
