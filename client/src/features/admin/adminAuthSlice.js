import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "",
    password:"",
};

const adminAuthSlice = createSlice({
    name: "adminAuth",  
    initialState,
    reducers: {
        loggedIn(state, action) {
            const {email,password}=action.payload;
            state.email = email;
            state.password = password;
            
        },
        // passwordChanged(state,action){
        //     const pass=action.payload;
        //     state.password=pass;
        // }
    },
});


export const { loggedIn,passwordChanged } = adminAuthSlice.actions;
export const selectEmail = (state) => state.adminAuth.email;

export const selectPassword = (state) => state.adminAuth.password;
export default adminAuthSlice.reducer;
