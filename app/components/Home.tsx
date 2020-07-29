import React from 'react';
import styles from './Home.css';
import Button from '@material-ui/core/Button';
import ReactJson from 'react-json-view'
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'
import { setSerialIdle,setSerialIdleTimeoutHandle,setReadCommand } from '../features/Home/HomeSlice'

interface State {
  readParams: Object
  writeParams: Object
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
}
class Home extends React.Component<Props ,State> {
  constructor(props:Props) {
    super(props)
    this.state = {
      readParams: {},
      writeParams: {}
    }
    this._tempData = Buffer.alloc(0);
    this.readHandle = this.readHandle.bind(this)
    this.dataHandle = this.dataHandle.bind(this)
    this.timeoutHanle = this.timeoutHanle.bind(this)
  }

  _tempData: Buffer

  async componentDidMount() {
  }

  readHandle() {
    this.props.serialport.on('data', this.dataHandle)
    this.props.setSerialIdle(false)
    this.props.setSerialIdleTimeoutHandle(
        setTimeout(this.timeoutHanle,1000)
    )
    this.props.serialport.write(this.props.readCommand+"\r\n")
  }

  dataHandle( data:Buffer ) {
    clearTimeout(this.props.serialIdleTimeoutHandle)
    this.props.setSerialIdleTimeoutHandle(
        setTimeout(this.timeoutHanle,1000)
    )
    this._tempData = Buffer.concat([this._tempData, data]) 
  }

  timeoutHanle() {
    console.log(this._tempData.toString())
    const recvString = this._tempData.toString()
    this._tempData = Buffer.alloc(0);

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
    const _strWithoutLB = _strWithoutEcho.slice(1)

    
    let json = null
    try {
      json = JSON.parse(_strWithoutLB)
    } catch(e) {
      throw new Error(`json parse fault, string is:\r\n ${_strWithoutLB}`)
    }

    this.props.setReadCommand(json)
  }

  render() {
    return(
      <div className={styles.container} data-tid="container">
        <div className={styles.contentRead}>
          <Button variant="contained" onClick={this.readHandle}>
          加载/刷新参数
          </Button>
          <ReactJson src={this.state.readParams} enableClipboard={false} />
        </div>
        <Divider orientation="vertical" className={styles.divider}></Divider>
        <div className={styles.contentWrite}>
          <Button variant="contained" color="secondary">
          确认烧写
          </Button>
          <ReactJson src={this.state.writeParams} enableClipboard={false} />
        </div>
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
    setReadCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
