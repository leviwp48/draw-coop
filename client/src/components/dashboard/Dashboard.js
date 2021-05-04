import React, { Component } from "react";
import "./Dashboard.css";
import axios from 'axios';
import Nav from "../nav/Nav";
import BoardList from "../boardlist/BoardList";
import Board from "../board/Board";
import jwt_decode from 'jwt-decode';

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
      display: []
    }
  }
 
  /*
  getBoardData = () => {
    axios.post(`http://localhost:3001/api/board/getMyBoards`, {userId: this.props.getUsername()})
    .then(res => {
      console.log("getting user's boards")
      console.log(res.data.boardData[2].boardData[0].b1)
      let boards = [];
      boards = res.data.boardData;
      console.log(boards[2].boardData[0].b1)
      this.setState({boardList: boards, boardsAdded: true});
      })
      .catch(err => {
        console.log(err.response)
      });
  }
*/

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("user");
    if(loggedInUser) {
      console.log("very nice")
      this.props.setUsername(jwt_decode(loggedInUser).username);
      this.props.setToken(loggedInUser);
      //console.log("without JSON: " + loggedInUser);
      //let foundUser = loggedInUser;
      //console.log("with JSON: " + foundUser);
    }
  }

  componentDidUpdate() {
    console.log("using effect")
    if(this.props.getTokenStatus() == true && this.state.boardsAdded == false){
      //this.getBoardData()
      console.log("adding board stuff");
    }
    // might not want to put this here but oh well I'm testing
    
  }

  createBoard = () => {
    axios.post(`http://localhost:3001/api/board/createBoard`, {userId: this.props.getUsername()})
      .then(res => {
        console.log("creating a new board for user: " + this.props.getUsername())
        })
        .catch(err => {
          console.log(err.response)
        });
    }

  handleUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  showLoginAndRegister = () => {
    console.log("token: " + this.props.getTokenStatus());    
  } 

  logout = () => {
    this.props.deleteToken();
  }

  goBack = () => {
    console.log("show board = false")
    this.setState({showBoard: false})
  }
  
  goToBoard = (boardId) => {
    axios.post(`http://localhost:3001/api/board/getBoard`, {boardId: boardId})
    .then(res => {
      console.log("dashboard board id: " + boardId)
      this.setState({showBoard: true, display: <Board boardId={boardId} boardData={res.data.boardData} goBack={this.goBack} />});
    })
      .catch(err => {
        console.log(err.response)
      });
  }
  
  // showList = () => {
  //   if(this.props.getTokenStatus() == true){
  //     return <BoardList getTokenStatus={this.props.getTokenStatus} username={this.props.getUsername()} goToBoard={this.goToBoard}/>
  //   }
  //   else{
  //     return <p> you should login </p>
  //   }
  // }

  setDisplay = () => {
    if(this.state.showBoard && this.props.getTokenStatus() == true){
      return this.state.display
    }
    else if(this.props.getTokenStatus() == true){
      return <BoardList getTokenStatus={this.props.getTokenStatus} username={this.props.getUsername()} goToBoard={this.goToBoard} createBoard={this.createBoard}/>
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


