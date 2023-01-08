import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
  filtersLoadingStatus: "idle",
  activeFilter: "all",
});

export const filteredHeroList = createAsyncThunk(
  "filters/fetchFilters",
  async () => {
    const { request } = useHttp();
    return await request("http://localhost:3001/filters");
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    activeFilterChanged: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(filteredHeroList.pending, (state) => {
        state.filtersLoadingStatus = "loading";
      })
      .addCase(filteredHeroList.fulfilled, (state, action) => {
        filterAdapter.setAll(state, action.payload);
        state.filtersLoadingStatus = "idle";
      })
      .addCase(filteredHeroList.rejected, (state) => {
        state.filtersLoadingStatus = "error";
      });
  },
});

const { actions, reducer } = filtersSlice;

export default reducer;
export const { selectAll } = filterAdapter.getSelectors(
  (state) => state.filters
);
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  activeFilterChanged,
} = actions;
