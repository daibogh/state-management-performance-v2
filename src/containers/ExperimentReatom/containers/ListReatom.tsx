import { FC, useCallback, useContext, useMemo, useState } from "react";
import { useAtom } from "@reatom/react";
import { listAtom } from "../store/listAtom";
import { usePerformanceMeasure } from "../../../hooks/usePerformanceMeasure";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";

export const ListReatom: FC = () => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const [items, { setList, updateList }] = useAtom(listAtom);
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
  return (
    <div>
      <ul>
        {items.map((item, idx) => (
          <li
            key={idx}
            style={{
              background: item.backgroundColor,
              width: item.width,
            }}
          />
        ))}
      </ul>
    </div>
  );
};
