import React from 'react'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import style from './Header.css'

import { connect } from 'react-redux'
import serialPort from 'serialport'
import {setSerialport, setReadCommand, setWriteCommand } from '../features/Home/HomeSlice'

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            readParams: {},
            writeParams: {},
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
        this.dataHandle = this.dataHandle.bind(this)
    }

    async componentDidMount() {
        const list = await serialPort.list()
        this.setState({
          ...this.state,
          serialPortList: list
        })
    }

    
    handleChange(event) {
        this.setState({
            ...this.state,
            serialPort: event.target.value,
        })
        const serialport = new serialPort(event.target.value, {baudRate: 115200},(err)=>{
            if (err) {
                return console.log('Error: ', err.message)
              }
        })
        this.props.setSerialport(serialport)
        serialport.on('data', this.dataHandle)
        serialport.on('end', ()=>{
            console.log(this._tempData.toString())
            this._tempData = null
        })
    }

    dataHandle(data) {
        if(this._idle) {
            clearTimeout(this.idle)
            this.idle=null
        } else {
            console.log(this._tempData.toString())
            return
        }
        this._idle = setTimeout(1000,()=>{
            this._idle = null
        })
        this._tempData = Buffer.alloc(1024);
        this._tempData = Buffer.concat([this._tempData, data]) 
           
    }

    TextFiledChange(target, event) {
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
                <TextField value={this.state.readCommand} onChange={this.TextFiledChange.bind(this, 'read')} className={style.commandInput} id="standard-basic" label="read command" />
                <TextField value={this.state.writeCommand} onChange={this.TextFiledChange.bind(this, 'write')} className={style.commandInput} id="standard-basic" label="write command" />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        serialport: state.home.serialport,
        readCommand: state.home.readCommand,
        writeCommand: state.home.writeCommand
    }
}

const mapDispatchToProps  = {
        setSerialport,
        setReadCommand,
        setWriteCommand
}
export default connect(mapStateToProps,mapDispatchToProps)(Header)