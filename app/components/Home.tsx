import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import Button from '@material-ui/core/Button';
import ReactJson from 'react-json-view'
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import serialPort from 'serialport'

interface State {
  readParams: Object
  writeParams: Object
  serialPort: string
  serialPortList: Array<Object>
}

interface Props {}
export default class Home extends React.Component<Props ,State> {
  constructor(props:Props) {
    super(props)
    this.state = {
      readParams: {},
      writeParams: {},
      serialPort: '暂无选择',
      /** serialPortList 元素内容:
        [{locationId: "Port_#0004.Hub_#0002"
        manufacturer: "wch.cn"
        path: "COM13"
        pnpId: "USB\\VID_1A86&PID_7523\\6&683C290&0&4"
        productId: "7523"
        serialNumber:"6&683c290&0&4"
        vendorId: xxxxxx}]
       */
      serialPortList: []
    }
    this.handleChange = this.handleChange.bind(this)
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
      serialPort: event.target.value
    })
  }

  render() {
    return(
      <div className={styles.container} data-tid="container">
        <div>
          <h2>PrograMan参数烧写器</h2>
          <span>Author:renmingrui</span>
        </div> 
        <FormControl className={styles.serialPortSelectContainer}>
          <InputLabel id="demo-simple-select-outlined-label">选择串口</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={this.state.serialPort}
            onChange={this.handleChange}
            label="选择串口"
            className={styles.serialPortSelect}
          >
            {this.state.serialPortList.map(v=>{
              return (
              <MenuItem value={v.path}>{v.path}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <div className={styles.content}>
          <Button variant="contained" color="primary">
          加载/刷新参数
          </Button>
          <ReactJson src={this.state.readParams} theme="default" enableClipboard={false} />
        </div>
        <Divider style={{'backgroundColor': 'white'}}/>
        <div className={styles.content}>
          <ReactJson src={this.state.readParams} theme="default" enableClipboard={false} />
          <Button variant="contained" color="primary">
          确认烧写
          </Button>
        </div>
      </div>
    );
  }
}
