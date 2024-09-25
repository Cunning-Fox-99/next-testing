// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/types/user.type';

interface UserState {
    user: UserType | null;
    loading: boolean;
}

const initialState: UserState = {
    user: null,
    loading: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserType>) {
            state.user = action.payload;
            state.loading = false;
        },
        clearUser(state) {
            state.user = null;
            state.loading = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
