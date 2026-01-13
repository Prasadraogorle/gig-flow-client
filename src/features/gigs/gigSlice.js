import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchGigs = createAsyncThunk(
  "gigs/fetch",
  async (search = "") => {
    const res = await api.get(`/gigs?search=${search}`);
    return res.data;
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchGigs.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  }
});

export default gigSlice.reducer;
