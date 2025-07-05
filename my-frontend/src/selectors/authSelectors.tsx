import { RootState } from "../reducers";

export const selecIsAuthenticaticated = (state : RootState) => state.auth.isAuthenticated;
export const selecUserInfo =  (state : RootState) => state.auth.userInfo;
export const selectToken =  (state : RootState) => state.auth.token;