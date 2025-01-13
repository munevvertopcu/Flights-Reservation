import instance from '../../../services/instance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    flights: [],
    isLoading: false,
    page: 0,
    totalPages: null,
    selectionTripMode: 1,
    selectionDirectionMode: 1,
    error: null,
    statusText: null
}

export const fetchFlights = createAsyncThunk('flights/fetchFlights', async ({ route, date, page, direction }, { rejectWithValue }) => {
    try {
        const response = await instance.get(`/flights?scheduleDate=${date}&flightDirection=${direction}&route=${route}&page=${page}`);
        console.log(response)
        const linkHeader = response.headers.link;
        const data = Array.isArray(response.data.flights) ? response.data.flights : [];
        return { flights: data, linkHeader: linkHeader || null, statusText: response.statusText };
    } catch (error) {
        console.error('Error fetching flights:', error);
        return rejectWithValue(error?.response?.data || error.message || 'Something went wrong');
    }
})

const flightListSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        resetFlights: (state) => {
            state.flights = [];
            state.page = 0;
            state.totalPages = null;
            state.error = null;
        },
        setSelectionTripMode: (state, action) => {
            state.selectionTripMode = action.payload
        },
        setSelectionDirectionMode: (state, action) => {
            state.selectionDirectionMode = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlights.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFlights.fulfilled, (state, action) => {
                state.isLoading = false;
                const { linkHeader, flights, statusText } = action.payload;
                state.statusText = statusText;
                state.flights = [...state.flights, ...flights];
                state.page += 1;

                if (linkHeader) {
                    const totalPagesMatch = linkHeader?.match(/&page=(\d+)>; rel="last"/);
                    if (totalPagesMatch) {
                        state.totalPages = Number(totalPagesMatch[1]);
                    }
                }
            })
            .addCase(fetchFlights.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'An error occurred while fetching flights';
            })

    }
})

export const { resetFlights, setSelectionTripMode, setSelectionDirectionMode } = flightListSlice.actions;
export default flightListSlice.reducer;