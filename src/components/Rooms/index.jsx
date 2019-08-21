import React from 'react'
import RoomContainer from '../../containers/roomlist'
import NavBar from '../NavBar'
import Footer from '../Footer'
import {Button} from 'reactstrap'
import '../../styles/Room/room.css'
import ChooseRoomContainer from '../../containers/choose-room'
import {Slider, Modal} from 'antd'
import {withRouter} from 'react-router-dom';
import {message} from 'antd'
import {connect} from 'react-redux' 
import uuid from "uuid";
import {bindActionCreators} from 'redux'
import * as gameActions from '../../actions';

const marks = {
  0: '$0',
  
  1000: {
    label: <strong>$1000</strong>,
  },
};

class Room extends React.Component{ 
  

  state = { 
    visible: false,
    money: 0,
    waiting: false,
    confirmLoading:false
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e.value);
    this.setState({
      visible: false,
    });
    
    if (this.props.user.money < this.state.money){
      message.error("Your money is not enough!");  
    }
    else{
      this.setState({
        waiting:true
      })
    
    }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleWaitingOk = e =>{
    console.log(e.value);
    this.setState({
      confirmLoading: true
    });

    setTimeout(() => {
      this.setState({
        waiting: false,
        confirmLoading: false,
      });

      let roomObject = {
        id:uuid.v4(),
        name:"Room's "+this.props.user.username,
        createdAt:(new Date()).toLocaleString(),
        betMoney: this.state.money,
        host: this.props.user.username
      }
      this.props.actions.chooseRoom(roomObject);
    
      message.success("Join room");
      this.props.history.push('/play');
    }, 5000);

  }

  handleWaitingCancel = e =>{
    console.log(e.value);
    this.setState({
      waiting: false
    });
  }
  
  onAfterChangeSlider(value) {
    console.log('onAfterChange: ', value);
  }

  onChange(value) {
    console.log('changed', value);
    this.setState({money: value})
  }

  render(){
    const { money } = this.state;
    return(
      <div>
        <NavBar/>
        <div className="container container-room">
          < RoomContainer/>
          <ChooseRoomContainer/>
        </div>
        
        <div className="container">
        <div className="row">
        <Button color="primary" className="btn-create-room" onClick={this.showModal}>
          +
        </Button>
        </div>
        </div>

        <Modal
          visible={this.state.visible}
          title="Choose bet money" 
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          
        >
          <div className="money">$ {money}</div>

          <Slider marks={marks} defaultValue={0} min={0}
            max={1000}
            onAfterChange={this.onAfterChangeSlider} onChange={this.onChange.bind(this)} />
        </Modal>

        <Modal
          title="Are you ready?"
          visible={this.state.waiting}
          onOk={this.handleWaitingOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleWaitingCancel}
        >
          <p className="text-ask">Click OK to wait for other join your room...</p>
        </Modal>
    
        <Footer/>
      </div>
    )
  };

}

function mapsStateToProps(state){
  return {
    user:state.user,
    userO: state.userOCurrent.User0
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

export default withRouter(connect(mapsStateToProps,mapDispatchToProps)(Room));