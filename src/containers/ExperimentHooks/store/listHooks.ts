import { useCallback, useMemo, useRef, useState } from "react";
import { useBoolean } from "react-use";

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
