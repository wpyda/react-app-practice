import {database, auth, googleProvider} from '../firebase'

const SET_USER = 'auth/SET_USER'
const SET_LOGIN_LOGS = 'auth/SET_LOGIN_LOGS'

const setUser = (user) => ({
    type: SET_USER,
    userData: user
})

const setLoginLogs = (logs) => ({
    type: SET_LOGIN_LOGS,
    logsData: logs
})

export const initAuth = () => (dispatch, getState) => {
    auth.onAuthStateChanged((user) => {
        // if not logged in, user is null
        dispatch(setUser(user))

        if (user) { // check if not null
            dispatch(logLoginDate())
            dispatch(syncLoginLogs())
        }

    })
}

const syncLoginLogs = () => (dispatch, getState) => {
    const uid = getState().auth.user.uid
    database.ref(`/users/${uid}/loginLogs`)
        .on('value', (snapshot) => dispatch(setLoginLogs(snapshot.val())))
}

const logLoginDate = () => (dispatch, getState) => {
    const uid = getState().auth.user.uid
    database.ref(`/users/${uid}/loginLogs`)
        .push({timestamp: Date.now()})
        .then(() => console.log('Login date successfully logged in db'))
        .catch(() => alert('Something wrong'))
}

export const logIn = (email, password) => (dispatch, getState) => {
    auth.signInWithEmailAndPassword(email, password)
        .then(() => console.log('Logged in'))
        .catch(() => alert('Something wrong'))
}

export const logInByGoogle = () => (dispatch, getState) => {
    auth.signInWithPopup(googleProvider)
        .then(() => console.log('Logged in'))
        .catch(() => alert('Something wrong'))
}

export const createUser = (email, password) => (dispatch, getState) => {
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => console.log('User registered'))
        .catch(() => alert('Something wrong'))
}

const initialState = {
    user: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.userData
            }

        case SET_LOGIN_LOGS:
            return {
                ...state,
                loginLogs: action.logsData
            }

        default:
            return state
    }
}