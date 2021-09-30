import React, {Component, Context } from "react";
import './UserList.css';

class Chat extends Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
        <div className="userList-container">
          <div className="userList">  
            {this.props.userList}        
          </div>    
        </div>
        )
    }
}
      
    export default UserList;