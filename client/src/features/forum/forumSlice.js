import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
};

const forumSlice = createSlice({
    name: "forumAuth",  
    initialState,
    reducers: {
        loggedIn(state, action) {
            state.email = action.payload;
        },
    },
});


export const { loggedIn } = forumSlice.actions;
export const selectEmail = (state) => state.forumAuth.email;
export default forumSlice.reducer;
