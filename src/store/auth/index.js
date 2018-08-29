export const ROUTECHECKED = 'auth/ROUTECHECKED'


const initState = {
    checkedRoute: {}
}

export default (state = initState, action) => {
    switch (action.type) {
        case ROUTECHECKED:
            return {
                ...state,
                checkedRoute: action.data
            }
        default:
            return state
    }
}


export const setRouteChecked = (data) => dispatch => {
    return new Promise(resolve => {
        dispatch({
            type: ROUTECHECKED,
            data
        })
        resolve(data)
    })
}
