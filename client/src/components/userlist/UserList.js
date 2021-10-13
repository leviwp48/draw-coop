import React, {Component, Context } from "react";
import './UserList.css';
import User from '../user/User'
import userImage from '../../assets/users/banana-fruit.png'

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
                <User user={user} userImage={userImage} key={id}/>
          )}  
        </div>
        )
    }
}
      
    export default UserList;