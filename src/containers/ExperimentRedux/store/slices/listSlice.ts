import { createSlice } from "@reduxjs/toolkit";
import { BIG_COLLECTION } from "../../../../constants/collections";

export const listSlice = createSlice({
  name: "list",
  initialState: {
    value: [] as { width: number; backgroundColor: string }[],
    isActiveConnection: false,
    otherList: [] as number[],
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
    update: (state, action: { payload: [number] }) => {
      const [index] = action.payload;
      if (state.value[index].width < 100) state.value[index].width += 5;
    },
    stop: (state) => {
      state.isActiveConnection = false;
    },
    startWithBackground: (state) => {
      state.otherList = BIG_COLLECTION;
    },
    backgroundOperation: (state) => {
      state.otherList.push(0);
    },
    clearBackground: (state) => {
      state.otherList = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  set: setList,
  update: updateList,
  stop: stopFetching,
  startWithBackground,
  backgroundOperation,
  clearBackground,
} = listSlice.actions;

export default listSlice.reducer;
