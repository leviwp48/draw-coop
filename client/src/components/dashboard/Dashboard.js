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
      usernameError: "",
      passwordError: "",
      formValid: true,
      update: false,
      endingCredits: "ending-credits",
    }
  }

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("user");
    if(loggedInUser) {
      this.props.setUsername(jwt_decode(loggedInUser).username);
      this.props.setToken(loggedInUser);
    }
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
      this.save(boardId, boardState, boardRef)
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
    console.log(JSON.stringify(boardId))
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
  
  createBoard = () => {
    axios.post(`${ENDPOINT}api/board/createBoard`, {userId: this.props.getUsername()})
      .then(res => {
        console.log("creating a new board for user: " + this.props.getUsername())
        console.log(JSON.stringify(res))
        console.log(res.data)
        this.goToBoard(res.data)
        })
        .catch(err => {
          console.log(err.response)
        });
    }

  showModalLogin = () => {
    this.setState({
      show: true,
      modalType: true,
      endingCredits: "ending-credits-modal",
    });
  };

  showModalRegister = () => {
    this.setState({
      show: true,
      modalType: false,
      endingCredits: "ending-credits-modal",
    });
  };

  hideModal = (e) => { 
    if (e.target.className != "modal-main" && e.target.className != "button-submit" && e.target.className != "input-username" && e.target.className !="input-password" && e.target.className != "modal-submit" && e.target.className != "modal-title" && e.target.className != "modal-text" && e.target.className != "title-text" && e.target.className != "option-btn" && e.target.className != "username-error" && e.target.className != "password-error" && e.target.className != "label-username" && e.target.className != "label-password"){
      this.setState({ 
        show: false,
        endingCredits: "ending-credits",
      });
    }
  };

  handleSubmitLogin = (e) => {
    e.preventDefault();

    if(this.state.username == ""){
      this.setState({usernameError: "Username can't be blank", formValid: false})
    }

    if(this.state.password == ""){
      this.setState({passwordError: "Password can't be blank", formValid: false})
    }

    const user = {
      username: this.state.username,
      password: this.state.password,
    };
    
    if(this.state.formValid){
      axios.post(`${ENDPOINT}api/users/login`, user)
      .then(res => {
        this.props.setUsername(jwt_decode(res.data.token).username);
        this.props.setToken(res.data.token);
        this.setState({show: false});
        sessionStorage.setItem('user', res.data.token)
        
      })     
      .catch(err => {
        if(err.response.status == 404){
          alert("No user found")
        }
        console.log(err.response)
      });
    }  
  }

  handleSubmitRegister = (e) => {
    e.preventDefault();

    if(this.state.password == ""){
      this.setState({passwordError: "Password can't be blank", formValid: false})
    }

    if(this.state.username == ""){
      this.setState({usernameError: "Username can't be blank", formValid: false})
    }

    const user = {
      username: this.state.username,
      password: this.state.password,
    };

    if(this.state.formValid){
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
    this.setState({ username: e.target.value, formValid: true, usernameError: "" });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value, formValid: true, passwordError: "" });
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
            <p className="title"> Drawsome </p>
            <p className="description-text"> A place to finally draw that perfect picture you've been dreaming of... well unless your friends scribble all over it  </p>
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

  setEndingCredits = () => {
    if(this.state.show==true){
      this.setState({endingCredits: "ending-credits-modal"}) 
    }
    else{
      this.setState({endingCredits: "ending-credits"}) 
    }
  }

  changeModalType = () => {
    this.setState({modalType: !this.state.modalType})
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
          changeModalType={this.changeModalType}
        >
          <label for="input-username" className="label-username">Username</label>
          <input
            className="input-username"
            id="input"
            type="text"
            placeholder="username"
            maxlength="40"
            value={this.username}
            onChange={this.handleUsernameChange}
            onKeyPress={this.onEnter}
          />
          <p className="username-error">{this.state.usernameError}</p>
          <label for="input-password" className="label-password">Password</label>
          <input
            className="input-password"
            id="input"
            type="text"
            placeholder="password"
            maxlength="40"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            onKeyPress={this.onEnter}
          />
          <p className="password-error">{this.state.passwordError}</p>

        </Modal>
        <div>        
          <Nav setUsername={this.props.setUsername} getUsername={this.props.getUsername} 
              setToken={this.props.setToken} getToken={this.props.getToken} getTokenStatus={this.props.getTokenStatus}
              deleteToken={this.props.deleteToken} setUserId={this.setUserId} setBoardData={this.setBoardData} setEndingCredits={this.setEndingCredits} hideModal={this.hideModal}
              showModalLogin={this.showModalLogin} showModalRegister={this.showModalRegister} show={this.state.show}/>
          {this.setDisplay()}
          <div className="credits">
            <div className={this.state.endingCredits}>
                Built and designed by Levi Pole.
                All rights reserved. ©
            </div>
          </div>
          <div className="my-info">
            
              <a href="https://github.com/leviwp48"><div className="github-image"/></a> 
              <a href="https://www.linkedin.com/in/polelevi/"> <div className="linkedIn-image"/> </a>
              <a href="mailto:levi@levipole.com"> <div className="email-image"/> </a>
            
          </div>
        </div>  
      </div>
    );
  }
}

/*
 <div className="outro-container">
          <p className="outro-message"> Thanks for coming! </p>
        </div>
*/
