import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useStore } from "effector-react";
import {
  $listStore,
  backgroundEvent$,
  setList,
  startWithBackground$,
  updateList,
} from "../store/listStore";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { List } from "../../../components/List";
import { useMeasureMarks } from "use-measure-marks";
import {
  useCollectionSize,
  useIsBackgroundOperation,
} from "../../../hooks/useRouteParams";

export const ListEffector: React.FC = () => {
  const items = useStore($listStore);
  const setMeasure = useContext(MeasureResultContext)[1];
  const { startMark, endMark, collectPerformanceList } = useMeasureMarks({
    startMark: "effector:list:update--start",
    endMark: "effector:list:update--end",
    measureMark: "effector:list:re-render",
  });
  const isBackgroundOp = useIsBackgroundOperation();
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBackgroundOp) {
      startWithBackground$();
      timer = setInterval(() => {
        backgroundEvent$();
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBackgroundOp]);
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
