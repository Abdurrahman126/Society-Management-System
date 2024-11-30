import store from "../../store/store"

export const checkAdmin = () => {
  const state = store.getState();
  const email = state.adminAuth.email; 
  const password = state.adminAuth.password; 

   return email && password;
};
