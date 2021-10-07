import React, {useRef, useState, useEffect} from "react";
import "./User.css";

const User = ({user}) =>{

        return (
            <div className="user-container">
               {user}
            </div>
        )
    }
    
export default User; 