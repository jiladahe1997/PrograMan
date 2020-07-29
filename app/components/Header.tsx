import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import style from './Header.css'

import { connect } from 'react-redux'
import serialPort from 'serialport'
import {setSerialport, setReadCommand, setWriteCommand,setSerialIdle, setSerialIdleTimeoutHandle } from '../features/Home/HomeSlice'

interface Props {
    serialport: Object,
    readCommand: string,
    writeCommand: string,
    serialIdle: boolean,
    serialIdleTimeoutHandle: NodeJS.Timeout,
    setSerialport: Function,
    setReadCommand: Function,
    setWriteCommand: Function,
    setSerialIdle: Function,
    setSerialIdleTimeoutHandle: Function
}

interface State {
    serialPort: string,
    serialPortList: Array<any>,
}

class Header extends React.Component<Props, State> {
    constructor(props:Props) {
        super(props)
        this.state = {
            serialPort: '',
            /** serialPortList 元素内容:
             [{locationId: "Port_#0004.Hub_#0002"
             manufacturer: "wch.cn"
             path: "COM13"
             pnpId: "USB\\VID_1A86&PID_7523\\6&683C290&0&4"
             productId: "7523"
             serialNumber:"6&683c290&0&4"
             vendorId: xxxxxx}]
             */
            serialPortList: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.TextFiledChange = this.TextFiledChange.bind(this)
    }

    async componentDidMount() {
        const list = await serialPort.list()
        this.setState({
          ...this.state,
          serialPortList: list
        })
    }

    handleChange(event:any) {
        this.setState({
            ...this.state,
            serialPort: event.target.value,
        })
        const serialport = new serialPort(event.target.value, {baudRate: 115200},(err:any)=>{
          if (err) {
              return console.log('Error: ', err.message)
            }
        })
        this.props.setSerialport(serialport)
    }

    TextFiledChange(target:string, event:any) {
        switch (target) {
            case 'read':
                this.props.setReadCommand(event.target.value)
                break;

            case 'write':
                this.props.setWriteCommand(event.target.value)
                break;
        
        }
    }

    render() {
        return (
            <div>
                <span className={style['text']}>Serial Port</span>
                <FormControl className={style.serialPortSelectContainer}>
                    <InputLabel id="demo-simple-select-outlined-label">选择串口</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={this.state.serialPort}
                        onChange={this.handleChange}
                        label="选择串口"
                        className={style.serialPortSelect}
                    >
                        {this.state.serialPortList.map((v,idx)=>{
                        return (
                        <MenuItem value={v.path} key={idx}>{v.path}</MenuItem>
                        )
                        })}
                    </Select>
                </FormControl>
                <TextField value={this.props.readCommand} onChange={this.TextFiledChange.bind(this, 'read')} className={style.commandInput} id="standard-basic" label="read command" />
                <TextField value={this.props.writeCommand} onChange={this.TextFiledChange.bind(this, 'write')} className={style.commandInput} id="standard-basic" label="write command" />
            </div>
        )
    }
}

const mapStateToProps = (state:any) => {
    return {
        serialport: state.home.serialport,
        readCommand: state.home.readCommand,
        writeCommand: state.home.writeCommand,
        serialIdle: state.home.serialIdle,
        serialIdleTimeoutHandle: state.home.serialIdleTimeoutHandle
    }
}

const mapDispatchToProps  = {
        setSerialport,
        setReadCommand,
        setWriteCommand,
        setSerialIdle,
        setSerialIdleTimeoutHandle
}
export default connect(mapStateToProps,mapDispatchToProps)(Header)