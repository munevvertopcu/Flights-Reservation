import instance from '../../../services/instance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    flights: [],
    isLoading: false,
    page: 0,
    totalPages: null,
}

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async ({ route, date, page, direction }) => {
    try {
        const response = await instance.get(`/flights?scheduleDate=${date}&flightDirection=${direction}&route=${route}&page=${page}`);
        const linkHeader = response.headers.link;
        const data = response.data.flights;
        console.log("API Response:", response.headers.link);
        return { flights: data, linkHeader: linkHeader || null };
    } catch (error) {
        return error
    }
})

const flightListSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        resetFlights(state) {
            state.flights = [];
            state.page = 0;
            state.totalPages = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlights.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.isLoading = false;
                const { linkHeader, flights } = action.payload;
                state.flights = [...state.flights, ...flights];
                state.page += 1;

                if (linkHeader) {
                    const totalPagesMatch = linkHeader?.match(/&page=(\d+)>; rel="last"/);
                    if (totalPagesMatch) {
                        state.totalPages = Number(totalPagesMatch[1]);
                    }
                }
            })
            .addCase(fetchFlights.rejected, (state) => {
                state.isLoading = false;
            })

    }
})

export const { resetFlights } = flightListSlice.actions;
export default flightListSlice.reducer;