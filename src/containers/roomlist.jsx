import React, {Component} from 'react'
import {connect} from 'react-redux'
import Pagination from '../components/Rooms/pagination'
import '../styles/Room/room.css'
import {chooseRoom} from '../actions/index';
import {bindActionCreators} from 'redux';
import socketIOClient from "socket.io-client";
import * as gameActions from "../actions/index";
import {SOCKET_SERVER} from '../constants/variable';

class RoomList extends Component {

  state = {
    allRooms: [],
    currentRooms: [],
    currentPage: null,
    totalPages: null,
    endpoint: SOCKET_SERVER
  };

  // send = () => {
  //   const socket = socketIOClient(this.state.endpoint);
  //   socket.emit("load-game-from-client")
  // }

  // componentDidMount = () => {
  //   this.setState({allRooms:this.props.rooms})
  // }

  componentWillMount(){
    const socket = socketIOClient(this.state.endpoint);
    socket.on('socket-id-from-server', (data) => {
     console.log(data);
     let userSocket = Object.assign({}, this.props.user);
     userSocket.idsocket = data.socket_id;
     userSocket.socket = socket;
     this.props.actions.updateUser(userSocket);
    })

    //console.log(this.props.rooms);

    socket.on('load-game-from-server', (data) => {
      //console.log(JSON.parse(data).list);
      let dataCraw = JSON.parse(data).list
      //let oldData = this.props.rooms;
      
      const curPage = this.state.currentPage?this.state.currentPage:1;
      this.setState({
        allRooms:dataCraw,
        currentRooms: (dataCraw?dataCraw.slice((curPage-1)*8, curPage*8):null),
        currentPage: curPage,
        totalPages:dataCraw?dataCraw.length:0
       });
      //socket.removeListener('load-game-from-server');
    })
  }

  // componentWillReceiveProps = props => {
  //   this.setState({
  //     allRooms:props.rooms,
  //     currentRooms: props.rooms.slice(0, 8),
  //     currentPage: 1,
  //     totalPages:props.rooms.length
  //    });
  // }

  onPageChanged = data => {
    const { allRooms } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentRooms = allRooms.slice(offset, offset + pageLimit);

    this.setState({ currentRooms, currentPage, totalPages});
  };


  createRoomListItems(currentItems) {
    
    let listItems = 
      currentItems
      .map((eachRoom) => {
        return (
          <div key={eachRoom.id} className="col-lg-6 col-md-12 col-room">
            <div className="card-room" 
            onClick={() => {this.props.actions.chooseRoom(eachRoom)}}>
              <div>
                <div className="room-name">
                  {eachRoom.title}
                </div>
                <div className="room-created-at">
                  {eachRoom.created_at}
                </div>
              </div>
              <div className="room-bet-money">
                ${eachRoom.bet_money}
              </div>
            </div>
          </div>
        );
      })
    return listItems;
  }

  render() {
    const {
      allRooms,
      currentRooms
    } = this.state;
    const totalRooms = allRooms.length;
   
    if (totalRooms === 0) 
    return (
      <div>
        <h2 className="title-room-list">Total rooms: {totalRooms}</h2>
      </div>);
   
    return (
      <div>
        <h2 className="title-room-list">Total rooms: {totalRooms}</h2>

      <div className="row">
        {this.createRoomListItems(currentRooms)}
      </div>
       <div className="d-flex flex-row py-4 align-items-center justify-content-center">
       <Pagination
         totalRecords={totalRooms}
         pageLimit={8}
         pageNeighbours={1}
         onPageChanged={this.onPageChanged}
       />
     </div>
     
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

let RoomContainer = connect(mapStateToProps,mapDispatchToProps)(RoomList);
export default RoomContainer;