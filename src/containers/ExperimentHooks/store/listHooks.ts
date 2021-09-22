import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBoolean } from "react-use";
import { BIG_COLLECTION } from "../../../constants/collections";
import { useIsBackgroundOperation } from "../../../hooks/useRouteParams";

type ListItem = { width: number; backgroundColor: string };
export const useListState = () => {
  const [list, setList] = useState<ListItem[]>([]);
  const updateList = useCallback(([idx]: [number]) => {
    setList((list) =>
      list.map((elem, _idx) =>
        idx === _idx ? { ...elem, width: elem.width + 5 } : elem
      )
    );
  }, []);
  return useMemo(() => ({ list, setList, updateList }), [list, updateList]);
};
export const useListRef = () => {
  const [_, forceRender] = useBoolean(false);
  const list = useRef<ListItem[]>([]);
  const setList = useCallback(
    (value) => {
      list.current = value;
      forceRender();
    },
    [forceRender]
  );
  const updateList = useCallback(
    ([idx]: [number]) => {
      list.current[idx].width += 5;
      forceRender();
    },
    [forceRender]
  );
  return useMemo(
    () => ({ list: list.current, setList, updateList, _ }),
    [setList, updateList, _]
  );
};
export const useOtherListState = () => {
  const isBackgroundOp = useIsBackgroundOperation();
  const setState = useState<number[]>([])[1];
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBackgroundOp) {
      setState(BIG_COLLECTION);
      timer = setInterval(() => {
        setState((arr) => [...arr, 0]);
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBackgroundOp, setState]);
};
export const useOtherListRef = () => {
  const isBackgroundOp = useIsBackgroundOperation();
  const list = useRef<number[]>([]);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isBackgroundOp) {
      list.current = BIG_COLLECTION;
      timer = setInterval(() => {
        list.current.push(0);
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBackgroundOp]);
};
