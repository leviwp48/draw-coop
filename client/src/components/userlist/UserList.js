import React, {Component, Context } from "react";
import './UserList.css';

class UserList extends Component {
    constructor(props) {
      super(props);
    }

    // need to get the usernames sent here and then map them out. 
    render() {
        return (
        <div className="user-list-container">
          <div className="user-list-title">
            Ruffians
          </div>
          <div className="user-list">  
                  
          </div>    
        </div>
        )
    }
}
      
    export default UserList;