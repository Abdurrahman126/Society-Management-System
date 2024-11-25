import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    roll_number: "",
    password:"",
};

const loginSlice = createSlice({
    name: "loginAuth",  
    initialState,
    reducers: {
        loggedIn(state, action) {
            const {roll,pass}=action.payload;
            state.roll_number = roll;
            state.password = pass;
            
        },
        passwordChanged(state,action){
            const pass=action.payload;
            state.password=pass;
        }
    },
});


export const { loggedIn,passwordChanged } = loginSlice.actions;
export const selectRoll = (state) => state.loginAuth.roll_number;

export const selectPassword = (state) => state.loginAuth.password;
export default loginSlice.reducer;
