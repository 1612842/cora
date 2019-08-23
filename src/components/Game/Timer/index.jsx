import React, {Component} from 'react'
import CustomProgressBar from './progressBar'; 
import '../../../styles/Game/Timer.css'

import {connect} from "react-redux";
import * as gameActions from "../../../actions";
import {bindActionCreators} from "redux";


class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: 100
    }
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count - 1
      }))
      this.props.actions.updateCountdown(this.state.count);
    }, 1000)
  }

  componentWillReceiveProps = props =>{
    if (props.is_win===1||props.is_win===0){
      clearInterval(this.myInterval)
    }else{
      this.setState({
        count: 100
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const {count} = this.state;
    if (count === -1) {
      this.setState({count: 100})
    }
    return (
      <div className="container container-timer">
        <div className="row">
          <div className="col-2">
          <div className="title-turn">Turn: {this.props.piece_current}</div>
          </div>
          <div className="col-8">
            <CustomProgressBar percentage = {this.state.count/100*100}/>
          </div>

          <div className="col-2">
            <div className="timer">
              {count}
            </div>
          </div>
      </div>

      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    piece_current:state.gameReducer.piece_current
  }
);

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
