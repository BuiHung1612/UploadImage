
import { Dispatch } from 'redux';
import { createCancelTokenSource } from './../../ultis/CancelUtil';

enum cancelTSKeys {
    sendMessage = 'test.sendMessage'
}
export const ACTION_TYPES = {
    SET_IS_LOADING: 'Test/SET_IS_LOADING',
    SET_DATA: 'Test/SET_DATA',
    SET_ERROR_MESSAGE: 'Test/SET_ERROR_MESSAGE'
}
export const getTest = () => async (dispatch: Dispatch) => {
    const cancelToken = createCancelTokenSource(cancelTSKeys.sendMessage)
    dispatch({ type: ACTION_TYPES.SET_IS_LOADING, payload: { loading: true } })
    try {
        const result: any = await 
} catch () {

    }
}