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
            const {id}=action.payload;
            return state.filter(event => event.event_id !== id);
        }
    }
})


export const {eventsFetched,eventDeleted}=eventSlice.actions;
export default eventSlice.reducer;