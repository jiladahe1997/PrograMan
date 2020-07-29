import React from 'react';
import Home from '../components/Home';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import style from './HomePage.css'
import Divider from '@material-ui/core/Divider';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <div className={style.header}>
          <Header></Header>
        </div>
        <Divider></Divider>
        <div className={style.appcontainer}>
          <div className={style['appcontainer-sidebar']}>
            <SideBar></SideBar>
          </div>
          <Divider orientation="vertical" className={style.divider}></Divider>
          <div className={style['appcontainer-app']}>
            <Home></Home>
          </div>
        </div>
      </div>
    )
  }
}
