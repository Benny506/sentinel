import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    alerts: [],
    globalLoading: false,
    globalLoadingTitle: '',
    globalLoadingMessage: '',
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addAlert: (state, action) => {
            const id = Date.now()
            state.alerts.push({ id, ...action.payload })
        },
        removeAlert: (state, action) => {
            state.alerts = state.alerts.filter((alert) => alert.id !== action.payload)
        },
        setGlobalLoading: (state, action) => {
            const { loading, title, message } = action.payload
            state.globalLoading = loading
            state.globalLoadingTitle = title || ''
            state.globalLoadingMessage = message || ''
        },
    },
})

export const { addAlert, removeAlert, setGlobalLoading } = uiSlice.actions
export default uiSlice.reducer
