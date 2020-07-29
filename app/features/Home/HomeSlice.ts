import { createSlice } from "@reduxjs/toolkit";


const HomeSlice = createSlice({
    name: 'Home',
    initialState: {
        serialport: {},
        readCommand: "",
        writeCommand: ""
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
    }
})

export default HomeSlice.reducer

export const { setSerialport, setReadCommand, setWriteCommand } = HomeSlice.actions

export const selectSerialport = (state: any) => state.Home.Serialport;

export const selectReadCommand = (state: any) => state.Home.readCommand

export const selectWriteCommand = (state: any) => state.Home.writeCommand