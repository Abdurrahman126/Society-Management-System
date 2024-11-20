import { createSlice } from "@reduxjs/toolkit";
const initialState=[]

const eventSlice=createSlice({
    name:"event",
    initialState,
    reducers:{
        eventsFetched(state,action){
            return action.payload;
        },
        eventDeleted(state,action){
            const id=action.payload;
            console.log("im running")
            return state.filter(event => event.event_id !== id);
        }
    }
})


export const {eventsFetched,eventDeleted}=eventSlice.actions;
export const selectEvents=(state)=>state.event;
export default eventSlice.reducer;