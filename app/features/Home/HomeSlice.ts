import { createSlice } from "@reduxjs/toolkit";


const HomeSlice = createSlice({
    name: 'Home',
    initialState: {
        serialport: {},
        readCommand: "",
        writeCommand: "",
        serialIdle: true,
        serialIdleTimeoutHandle: null,
    },
    reducers: {
        setSerialport: (state, action) => {
            state.serialport = action.payload
        },
        setReadCommand: (state, action) => {
            state.readCommand = action.payload
        },
        setWriteCommand: (state, action) => {
            state.writeCommand = action.payload
        },
        setSerialIdle: (state, action) => {
            state.serialIdle = action.payload
        },
        setSerialIdleTimeoutHandle: (state, action) => {
            state.serialIdleTimeoutHandle = action.payload
        }
    }
})

export default HomeSlice.reducer

export const { 
    setSerialport, 
    setReadCommand, 
    setWriteCommand, 
    setSerialIdle, 
    setSerialIdleTimeoutHandle 
} = HomeSlice.actions