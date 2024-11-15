import instance from '../../../services/instance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    isLoading: false
}

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async ({route, date}) => {
    try {
        const response = await instance.get(`/flights?scheduleDate=${date}&route=${route}`);
        return response.data;
    } catch (error) {
        return error
    }
})

const flightListSlice = createSlice({
    name: 'flights',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlights.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchFlights.rejected, (state) => {
                state.isLoading = false;
            })

    }
})

export default flightListSlice.reducer;