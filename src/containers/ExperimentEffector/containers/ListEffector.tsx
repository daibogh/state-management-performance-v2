import React, { useCallback, useContext, useMemo } from "react";
import { useStore } from "effector-react";
import { $listStore, setList, updateList } from "../store/listStore";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { List } from "../../../components/List";

export const ListEffector: React.FC = () => {
  const items = useStore($listStore);
  const setMeasure = useContext(MeasureResultContext)[1];
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
        startMark();
        updateList(value);
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
  return <List items={items} />;
};
