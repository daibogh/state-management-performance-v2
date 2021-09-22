import {
  ComponentProps,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { observer } from "mobx-react-lite";
import { StoreContext } from "../store";
import { Socket } from "socket.io-client";
import { useConfigureExperiment } from "../../../hooks/useConfigureExperiment";
import { List } from "../../../components/List";
import { MeasureResultContext } from "../../../hooks/useMeasureResult";
import { useMeasureMarks } from "use-measure-marks";
import {
  useCollectionSize,
  useIsBackgroundOperation,
} from "../../../hooks/useRouteParams";
export const ListMobx: FC = observer(() => {
  const setMeasure = useContext(MeasureResultContext)[1];
  const {
    list: {
      value: items,
      setList,
      updateList,
      startWithBackground,
      backgroundOperation,
    },
  } = useContext(StoreContext);
  const { startMark, endMark, collectPerformanceList } = useMeasureMarks({
    startMark: "mobx:list:update--start",
    endMark: "mobx:list:update--end",
    measureMark: "mobx:list:re-render",
  });
  const size = useCollectionSize();
  const onOpenSocket = useCallback(
    (socket: Socket) => {
      socket.emit("list:get", size);
    },
    [size]
  );
  const isBackgroundOp = useIsBackgroundOperation();
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBackgroundOp) {
      startWithBackground();
      timer = setInterval(() => {
        backgroundOperation();
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [backgroundOperation, isBackgroundOp, startWithBackground]);
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
      <ObserverList items={items} />
    </div>
  );
});
const ObserverList: FC<ComponentProps<typeof List>> = observer(List);
