import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';
import Button from '@material-ui/core/Button';
import ReactJson from 'react-json-view'
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux'

interface State {
  readParams: Object
  writeParams: Object
}

interface Props {}
class Home extends React.Component<Props ,State> {
  constructor(props:Props) {
    super(props)
    this.state = {
      readParams: {},
      writeParams: {}
    }
    this.readHandle = this.readHandle.bind(this)
  }

  async componentDidMount() {
  }

  readHandle() {
    this.props.serialport.write(this.props.readCommand+"\r\n")
  }

  render() {
    return(
      <div className={styles.container} data-tid="container">
        <div className={styles.contentRead}>
          <Button variant="contained" onClick={this.readHandle}>
          加载/刷新参数
          </Button>
          <ReactJson src={this.state.readParams} theme="default" enableClipboard={false} />
        </div>
        <Divider orientation="vertical" className={styles.divider}></Divider>
        <div className={styles.contentWrite}>
          <Button variant="contained" color="secondary">
          确认烧写
          </Button>
          <ReactJson src={this.state.writeParams} theme="default" enableClipboard={false} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      serialport: state.home.serialport,
      readCommand: state.home.readCommand,
      writeCommand: state.home.writeCommand
  }
}

export default connect(mapStateToProps)(Home)
