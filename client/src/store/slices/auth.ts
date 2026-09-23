import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: "customer" | "admin";
    avator?: {
        url: string;
        public_id: string;
    };
}

interface AuthState {
    userInfo: UserInfo | null;
}

const storedUserInfo = localStorage.getItem("userInfo");

const initialState: AuthState = {
    userInfo: storedUserInfo
        ? JSON.parse(storedUserInfo)
        : null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setUserInfo: (
            state,
            action: PayloadAction<UserInfo>
        ) => {
            state.userInfo = action.payload;

            localStorage.setItem(
                "userInfo",
                JSON.stringify(action.payload)
            );
        },

        clearUserInfo: (state) => {
            state.userInfo = null;

            localStorage.removeItem("userInfo");
        },
    },
});

export const {
    setUserInfo,
    clearUserInfo,
} = authSlice.actions;

export default authSlice.reducer;