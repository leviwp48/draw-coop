import React ,{useState} from "react";
import "./BoardListItem.css" 

const BoardListItem = props =>{
    return (
        <div className="listItem">
            <div className="imgContainer">
                <img src={props.image} alt="" />
            </div>
            <div className="infoContainer"> 
                <p id="author"> {props.author} </p>
                <p id="lastModified"> {props.lastModified} </p>
            </div>
        </div>
    )
}
 
export default BoardListItem;