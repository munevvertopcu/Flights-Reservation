import { configureStore } from "@reduxjs/toolkit";
import flightsReducer from '../features/flightList/flightListSlice';

export const store = configureStore({
    reducer: {
        flights: flightsReducer
    }
})