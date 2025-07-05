export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
interface LoginSuccessAction {
    type : typeof LOGIN_SUCCESS;
    payload : {
        userInfo : {
            username : string,
            role : string,
            fullName : string,
            avataUrl : string
        };
        token : string
    };
}
interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;
    payload: string; // error message
}

interface LogoutAction {
    type: typeof LOGOUT;
}
export type AuthActionTypes = LoginSuccessAction | LoginFailureAction | LogoutAction;
