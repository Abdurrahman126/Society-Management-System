import { configureStore } from "@reduxjs/toolkit";
import forumAuthReducer from "../features/forum/forumSlice"; 
import loginSliceReducer from "../features/login/loginSlice";
import adminAuthSliceReducer from "../features/admin/adminAuthSlice"
const store = configureStore({
    reducer: {
        forumAuth: forumAuthReducer,  
        loginAuth:loginSliceReducer,
        adminAuth:adminAuthSliceReducer,
    },
});

export default store;
