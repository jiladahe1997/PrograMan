import { createSlice } from "@reduxjs/toolkit";

interface History {
    send: string
    recv: string
    time: Date
}

type SliceState = {
    serialport: any,
    readCommand: string
    writeCommand: string
    serialIdle: boolean,
    serialIdleTimeoutHandle: NodeJS.Timeout,
    history: Array<History>
}

// First approach: define the initial state using that type
const initialState: SliceState = {
    serialport: {},
    readCommand: "",
    writeCommand: "",
    serialIdle: true,
    serialIdleTimeoutHandle: setTimeout(()=>{},0),
    history: []
}

const HomeSlice = createSlice({
    name: 'Home',
    initialState,
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
        },
        addHistory: (state, action) => {
            state.history.unshift({
                send: action.payload.send,
                recv: action.payload.recv,
                time: new Date
            })
            state.history = Array.prototype.concat(state.history,[])
        },
        modifyHistory: (state, action) => {
            const target = state.history.find(v=>v.send == action.payload.send)
            if(!target) throw new Error("target find error")
            target.recv = action.payload.recv
        }
    }
})

export default HomeSlice.reducer

export const { 
    setSerialport, 
    setReadCommand, 
    setWriteCommand, 
    setSerialIdle, 
    setSerialIdleTimeoutHandle,
    addHistory,
    modifyHistory
} = HomeSlice.actions