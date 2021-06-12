import React, { Component } from "react";
import "./Dashboard.css";
import axios from 'axios';
import Nav from "../nav/Nav";
import BoardList from "../boardlist/BoardList";
import Board from "../board/Board";
import Chat from "../chat/Chat"
import jwt_decode from 'jwt-decode';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      image: "",
      author: "",
      lastModified: "",
      boardList: [],
      boardsAdded: false,
      showBoard: false,
      display: [],
      boardImage: "",
      boardState: [],
      socket: socketIOClient(ENDPOINT)
    }
  }

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("user");
    if(loggedInUser) {
      this.props.setUsername(jwt_decode(loggedInUser).username);
      this.props.setToken(loggedInUser);
    }
  }

  createBoard = () => {
    axios.post(`http://localhost:3001/api/board/createBoard`, {userId: this.props.getUsername()})
      .then(res => {
        console.log("creating a new board for user: " + this.props.getUsername())
        })
        .catch(err => {
          console.log(err.response)
        });
        this.forceUpdate({})
    }

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  }; 

  logout = () => {
    this.props.deleteToken();
  }

  convertBoardToImage = (board) => {
    var image = new Image();
    image.src = board.toDataURL("image/png");
    return image.src
  }

  goBack = (boardId, boardState, boardRef) => {
     axios.post(`http://localhost:3001/api/board/saveBoard`, {boardId: boardId, boardState: boardState, image: this.convertBoardToImage(boardRef)})
    .then(res => {
      console.log("Board was saved")
      this.setState({showBoard: false, display: ""})
      this.state.socket.emit("leaving", boardId)
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  save = (boardId, boardState, boardRef) => {
    axios.post(`http://localhost:3001/api/board/saveBoard`, {boardId: boardId, boardState: boardState, image: this.convertBoardToImage(boardRef)})
    .then(res => {
      console.log("Board was saved")
    })
    .catch(err => {
      console.log(err.response)
    })
  }
  
  goToBoard = (boardId) => {
    axios.post(`http://localhost:3001/api/board/getBoard`, {boardId: boardId, userId: this.props.getUsername()})
    .then(res => {
      this.state.socket.emit("joining", boardId, this.props.getUsername());
      this.setState({showBoard: true, display: 
        <>
          <Board socket={this.state.socket} boardId={boardId} boardData={res.data.boardData} goBack={this.goBack} save={this.save} convertBoardToImage={this.convertBoardToImage} />
          <Chat username={this.props.getUsername()} socket={this.state.socket} />
        </>
      });
    })
      .catch(err => {
        console.log(err.response)
      });
  }
  
  setDisplay = () => {
    if(this.state.showBoard && this.props.getTokenStatus() == true){
      return this.state.display
    }
    else if(this.props.getTokenStatus() == true){
      return (
      <>
        <BoardList getTokenStatus={this.props.getTokenStatus} username={this.props.getUsername()} goToBoard={this.goToBoard} createBoard={this.createBoard}/>
        <Chat username={this.props.getUsername()} socket={this.state.socket} />
      </>
      );
    }
    else{
      return <p> you should login </p>
    }
  }

  
  render() {
  
    return (
      <div>        
        <Nav setUsername={this.props.setUsername} getUsername={this.props.getUsername} 
             setToken={this.props.setToken} getToken={this.props.getToken} getTokenStatus={this.props.getTokenStatus}
             deleteToken={this.props.deleteToken} setUserId={this.setUserId} setBoardData={this.setBoardData}/>
        {this.setDisplay()}
             
      </div>
    );
  }
}


