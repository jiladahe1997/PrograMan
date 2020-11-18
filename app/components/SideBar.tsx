import React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux'
import { addHistory } from '../features/Home/HomeSlice'
import { withStyles } from '@material-ui/core/styles';

const materialStyles = ({
    accordionDetails: {
        'word-break': 'break-all',
    },
    accordionSummary: {
        'flex-wrap': 'wrap'
    },
    typography: {
        'font-size': '0.7rem'
    },
    typographyTitle: {
        'font-size': '0.8rem'
    },
    typographyTitleSmall: {
        'font-size': '0.7rem'
    },
    container: {
        'padding-right': '0.5vw',
        'overflow': 'auto',
        'display': 'flex',
        'flex-direction': 'column',
    },
    'historyList-container': {
      'overflow': 'auto'
    }
});
interface State {

} 
  
interface Props {
    history: Array<any>,
    addHistory: Function
    classes: any
}

class SideBar extends React.Component<Props ,State> {
    render() {
        return (
            <div className={this.props.classes.container}>
                <div>History</div>
                <div className={this.props.classes['historyList-container']}>
                    {this.props.history.map((v,idx)=>{
                        return (
                            <Accordion key={idx}>
                                <AccordionSummary classes={{content:this.props.classes.accordionSummary}}
                                >
                                    <Typography className={this.props.classes.typographyTitle}>{v.time.toLocaleString()}</Typography>
                                    <div className={this.props.classes.typographyTitleSmall}>{v.send}</div>
                                </AccordionSummary>
                                <AccordionDetails className={this.props.classes.accordionDetails}>
                                    <Typography className={this.props.classes.typography}>
                                        {v.recv}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state:any) => {
    return {
        history: state.home.history,
    }
  }
  
  const mapDispatchToProps  = {
    addHistory
  }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(materialStyles)(SideBar))