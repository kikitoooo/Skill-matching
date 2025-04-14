import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getResumesApi, uploadResumeApi } from "../../entities/api/api";
import { TResume } from "../../entities/models/types";

type TResumesState = {
  resumes: TResume[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TResumesState = {
  resumes: [],
  isLoading: true,
  error: null,
};

export const analyzeResume = createAsyncThunk(
  "resumes/analyzeResume",
  async (file: File) => {
    const result = await uploadResumeApi(file);
    return result;
  }
);

export const fetchResumes = createAsyncThunk(
  "resumes/getAllResumes",
  async () => await getResumesApi()
);
const resumesSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {},
  selectors: {
    selectResumes: (sliceState) => sliceState.resumes,
    selectIsLoading: (sliceState) => sliceState.isLoading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.resumes = action.payload;
        state.isLoading = false;
      })
      .addCase(analyzeResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Ошибка анализа резюме";
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes.push(action.payload);
      });
  },
});
export const { selectResumes, selectIsLoading } = resumesSlice.selectors;

export default resumesSlice.reducer;
