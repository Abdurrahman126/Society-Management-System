import store from "../../../store/store"; 

export const  checkAuth = () => {
  const state = store.getState();
  const roll_number = state.loginAuth.roll_number;
  const password = state.loginAuth.password;

  return roll_number && password;
};
