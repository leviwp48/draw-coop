import React, {Component, Context } from "react";
import './UserList.css';
import User from '../user/User'

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
          {this.props.userList.map((user, id) => 
                <User user={user} key={id}/>
          )}  
        </div>
        )
    }
}
      
    export default UserList;