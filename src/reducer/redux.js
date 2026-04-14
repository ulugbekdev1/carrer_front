import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  questions: [],
  answers: [],
  trace: 0,
  type: {},
  testId: 'no',
};

export const eventsSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTestIdAction: (state, action) => {
      state.testId = action.payload;
    },
    startExamAction: (state, action) => {
      let { question, testType } = action.payload;
      return {
        ...state,
        questions: question,
        type: testType,
      };
    },
    moveNextAction: (state) => {
      return {
        ...state,
        trace: state.trace + 1,
      };
    },
    movePrevAction: (state) => {
      return {
        ...state,
        trace: state.trace - 1,
      };
    },
    answersAction: (state, action) => {
      return {
        ...state,
        answers: [...state.answers, action.payload],
      };
    },
  },
});

export const {
  startExamAction,
  moveNextAction,
  movePrevAction,
  answersAction,
  setTestIdAction,
} = eventsSlice.actions;
export default eventsSlice.reducer;
