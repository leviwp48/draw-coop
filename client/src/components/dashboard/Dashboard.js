import React, { Component } from "react";
import "./Dashboard.css";
import axios from 'axios';
import Nav from "../nav/Nav";
import BoardList from "../boardlist/BoardList";
import Board from "../board/Board";
import Chat from "../chat/Chat"
import jwt_decode from 'jwt-decode';
import socketIOClient from "socket.io-client";
import Modal from "../login/LoginModal.js";
const ENDPOINT = "http://localhost:3001/";

// ---------------- Dashboard for all of the componenets ----------------
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
      socket: socketIOClient(ENDPOINT),
      show: false,
      modalType: true,
      username: "",
      password: "",
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
    axios.post(`${ENDPOINT}api/board/createBoard`, {userId: this.props.getUsername()})
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
     axios.post(`${ENDPOINT}api/board/saveBoard`, {boardId: boardId, boardState: boardState, image: this.convertBoardToImage(boardRef)})
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
    axios.post(`${ENDPOINT}api/board/saveBoard`, {boardId: boardId, boardState: boardState, image: this.convertBoardToImage(boardRef)})
    .then(res => {
      console.log("Board was saved")
    })
    .catch(err => {
      console.log(err.response)
    })
  }
  
  goToBoard = (boardId) => {
    axios.post(`${ENDPOINT}api/board/getBoard`, {boardId: boardId, userId: this.props.getUsername()})
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
  
  showModalLogin = () => {
    this.setState({
      show: true,
      modalType: true
    });
  };

  showModalRegister = () => {
    this.setState({
      show: true,
      modalType: false
    });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleSubmitLogin = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    
    axios.post(`${ENDPOINT}api/users/login`, user)
      .then(res => {
        this.props.setUsername(jwt_decode(res.data.token).username);
        this.props.setToken(res.data.token);
        this.setState({show: false});
        sessionStorage.setItem('user', res.data.token)
        
      })     
      .catch(err => {
        console.log(err.response)
      });
  }

  handleSubmitRegister = (e) => {
    e.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password,
    };

    axios.post(`${ENDPOINT}api/users/register`, user)
      .then(res => {
        this.setState({show: false});
        axios.post(`${ENDPOINT}api/users/login`, user)
        .then(res => {
          this.props.setToken(res.data.token);
          this.props.setUsername(jwt_decode(res.data.token).username);
          this.setState({show: false});
        })
        .catch(err => {
          console.log(err.response)
        });
      })
      .catch(err => {
        console.log(err.response)
      });
  }

  onEnter = (e) => {
    if (e.key === "Enter"){
      if(this.state.modalType === true){
        this.handleSubmitLogin(e)
      }
      else{
        this.handleSubmitRegister(e)
      }
    } 
  }

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

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
      return (
        <>
        <div className="intro-container">   
          <div className="intro">
            <p> Drawing stuff is better with friends </p>
          </div>
        </div>
        <div className="intro-login">
          <button
            className="dashboard-button-login"
            id="dashboard-user"
            type="button"
            onClick={() => this.showModalLogin()}
          >
          Login
          </button>
          or
          <button
            className="dashboard-button-register"
            id="dashboard-user"
            type="button"
            onClick={() => this.showModalRegister()}
          >
          Register
          </button>
          to start drawing
        </div>
        </>
      );
    }
  }

  
  render() {
    return (
      <div>
        <Modal 
          ref={node => this.node = node}
          show={this.state.show}
          submitRegister={this.handleSubmitRegister}
          submitLogin={this.handleSubmitLogin}
          onEnter={this.onEnter}
          modalType={this.state.modalType}
          handleClose={this.hideModal}
        >
          <input
            className="input-username"
            id="input"
            type="text"
            placeholder="username"
            value={this.username}
            onChange={this.handleUsernameChange}
            onKeyPress={this.onEnter}
          />
          <input
            className="input-password"
            id="input"
            type="text"
            placeholder="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyPress={this.onEnter}
          />
        </Modal>
        <div>        
          <Nav setUsername={this.props.setUsername} getUsername={this.props.getUsername} 
              setToken={this.props.setToken} getToken={this.props.getToken} getTokenStatus={this.props.getTokenStatus}
              deleteToken={this.props.deleteToken} setUserId={this.setUserId} setBoardData={this.setBoardData}/>
          {this.setDisplay()}
        </div>
        <div className="outro-container">
          <p className="outro-message"> Thanks for coming! </p>
        </div>
      </div>
    );
  }
}


