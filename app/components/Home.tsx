import React from 'react';
import styles from './Home.css';
import Button from '@material-ui/core/Button';
import ReactJson from 'react-json-view'
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import { connect } from 'react-redux'
import { setSerialIdle,setSerialIdleTimeoutHandle,setReadCommand, addHistory, modifyHistory } from '../features/Home/HomeSlice'
import { withStyles } from '@material-ui/core/styles';
import electronStore from '../electron-store/electron-store'

const materialStyles = ({
  actionButton: {
    margin: '1vh 0 1vh 0'
  }
});

enum workStatus {
  waitingReadData,
  waitingWriteData,
  idle
}
interface State {
  readParams: Object
  writeParams: Object
  status: workStatus
  errorMessageOpen: boolean
  erroeMessageStr: string
  successMessageOpen: boolean
} 

interface Props {
    serialport: any,
    readCommand: string,
    writeCommand: string,
    serialIdle: boolean,
    serialIdleTimeoutHandle: NodeJS.Timeout,
    setSerialIdle: Function,
    setSerialIdleTimeoutHandle: Function,
    setReadCommand: Function
    addHistory: Function
    modifyHistory: Function
    classes: any
}
class Home extends React.Component<Props ,State> {
  constructor(props:Props) {
    super(props)
    this.state = {
      readParams: {},
      writeParams: {},
      status: workStatus.idle,
      errorMessageOpen: false,
      erroeMessageStr: '',
      successMessageOpen: false
    }
    this._tempData = Buffer.alloc(0);
    this.readHandle = this.readHandle.bind(this)
    this.dataHandle = this.dataHandle.bind(this)
    this.timeoutHanle = this.timeoutHanle.bind(this)
    this.writeHandle = this.writeHandle.bind(this)
  }

  _tempData: Buffer

  async componentDidMount() {
  }

  readHandle() {
    try {
      this.props.serialport.on('data', this.dataHandle)
      this.props.setSerialIdle(false)
      this.props.setSerialIdleTimeoutHandle(
          setTimeout(this.timeoutHanle,1000)
      )
      this.props.addHistory({
        send: this.props.readCommand,
        recv: '',
      })
      this.setState({
        ...this.state,
        status: workStatus.waitingReadData
      },()=>this.props.serialport.write(this.props.readCommand.replace('\\r','\r')))
      electronStore.set('readCommand', this.props.readCommand)
    } catch(error) {
      this.setState({
        errorMessageOpen: true,
        erroeMessageStr: "操作失败，请检查串口是否打开！",
        readParams: {},
        writeParams: {},
        status: workStatus.idle
      })
    }
  }
  
  writeHandle() {
    try {
      this.props.serialport.on('data', this.dataHandle)
      this.props.setSerialIdle(false)
      this.props.setSerialIdleTimeoutHandle(
          setTimeout(this.timeoutHanle,1000)
      )
      this.props.addHistory({
        send: this.props.writeCommand,
        recv: '',
      })
      const str = this.props.writeCommand.replace('\\r','\r').replace('${json}',JSON.stringify(this.state.writeParams))
      this.setState({
        ...this.state,
        status: workStatus.waitingWriteData
      }, ()=>this.props.serialport.write(str))
      electronStore.set('writeCommand', this.props.writeCommand)
    } catch(error) {
      this.setState({
        errorMessageOpen: true,
        erroeMessageStr: "操作失败，请检查串口是否打开！",
        readParams: {},
        writeParams: {},
        status: workStatus.idle
      })
    }
  }

  dataHandle( data:Buffer ) {
    clearTimeout(this.props.serialIdleTimeoutHandle)
    this.props.setSerialIdleTimeoutHandle(
        setTimeout(this.timeoutHanle,1000)
    )
    console.debug(data.toString())
    this._tempData = Buffer.concat([this._tempData, data]) 
  }

  timeoutHanle() {
    /* debug */
    // this._tempData = Buffer.from('get_all_params \r\n{"name":"GNSS","params":{"dev_id":3866698,"hw_ver":65536,"sf_ver":65539},"iot_auth":{"product_key":"a1prkglRr7c","device_name":"TEST02","device_secret":"27754eacefcce2c53bb47b6ff9ee6366"},"gnss_server":{"ip4_addr":"123.57.186.122","port":11000}}')
    // this._tempData = Buffer.concat([this._tempData,Buffer.from([0x00])])
    // this._tempData = Buffer.concat([this._tempData,Buffer.from("msh>")])
    console.log(this._tempData.toString())
    const recvString = this._tempData.toString()
    this._tempData = Buffer.alloc(0);
    this.props.serialport.removeListener('data', this.dataHandle)

    try {
      if(this.state.status == workStatus.waitingWriteData) {
        this.props.modifyHistory({
          send: this.props.writeCommand,
          recv: recvString,
        })
        this.setState({
          ...this.state,
          status: workStatus.idle,
          errorMessageOpen: !recvString.includes("OK"),
          erroeMessageStr: "操作失败",
          successMessageOpen: recvString.includes("OK")
        })
      } 
  
      else if(this.state.status == workStatus.waitingReadData) {
        this.props.modifyHistory({
          send: this.props.readCommand,
          recv: recvString,
        })
        /* 
         * exclude echo character 
         *    example:
         *      help\r\n
         *      Command not recognised.  Enter 'help' to view a list of available commands.
         * 
         * so you must remove the first line echo 
         */
          const _strWithoutEcho = recvString.match(/\n[\s\S]+/ig)
          if(!_strWithoutEcho) throw new Error(`response fault, response is:\r\n ${recvString}`)
          /* due to regex have a Line Break(LB) '\n', must remove it first */
          const _strWithoutLB = _strWithoutEcho[0].slice(1)

          /**
           * 20201118 add:
           * match json string only, search for '{' and '}'.
           */
          const _strWithOnlyJson = _strWithoutLB.match(/{.*}/ig) || [];
      
          let json = null
          try {
            json = JSON.parse(_strWithOnlyJson[0])
          } catch(e) {
            throw new Error(`json parse fault, string is:\r\n ${recvString}`)
          }
      
          this.setState({
            ...this.state,
            readParams: json,
            writeParams: json,
            status: workStatus.idle
          })
      }
    } catch (error) {
      this.setState({
        errorMessageOpen: true,
        erroeMessageStr: error.message,
        readParams: {},
        writeParams: {},
        status: workStatus.idle
      })
    }
  }

  render() {
    return(
      <div className={styles.container} data-tid="container">
        <div className={styles.contentRead}>
          <Button className={this.props.classes.actionButton} variant="contained" onClick={this.readHandle}>
          加载/刷新参数
          </Button>
          <ReactJson src={this.state.readParams} enableClipboard={false} />
        </div>
        <Divider orientation="vertical" className={styles.divider}></Divider>
        <div className={styles.contentWrite}>
          <Button className={this.props.classes.actionButton} variant="contained" color="secondary" onClick={this.writeHandle}>
          确认烧写
          </Button>
          <ReactJson src={this.state.writeParams} enableClipboard={false} onEdit={(edit)=>this.setState({writeParams: edit.updated_src})}/>
        </div>
        <Backdrop className={styles.backdrop} open={this.state.status !== workStatus.idle} >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar open={this.state.errorMessageOpen} autoHideDuration={6000} onClose={()=>this.setState({errorMessageOpen:false})} >
          <MuiAlert severity="error">
            {this.state.erroeMessageStr}
          </MuiAlert>
        </Snackbar>
        <Snackbar open={this.state.successMessageOpen} autoHideDuration={6000} onClose={()=>this.setState({successMessageOpen:false})} >
          <MuiAlert severity="success">
            {"操作成功！请重新读取参数"}
          </MuiAlert>
        </Snackbar>
      </div>
    );
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
    setSerialIdle,
    setSerialIdleTimeoutHandle,
    setReadCommand,
    addHistory,
    modifyHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(Home))
