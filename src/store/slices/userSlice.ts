// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/types/user.type';

interface UserState {
    user: UserType | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserType | null>) {
            state.user = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
