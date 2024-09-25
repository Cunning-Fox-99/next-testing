// app/store/slices/tokenSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
    isValid: boolean;
}

const initialState: TokenState = {
    isValid: false,
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        setTokenValidity(state, action: PayloadAction<boolean>) {
            state.isValid = action.payload;
        },
    },
});

export const { setTokenValidity } = tokenSlice.actions;
export default tokenSlice.reducer;
