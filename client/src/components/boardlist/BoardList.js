import React ,{useEffect, useRef, useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";
import axios from 'axios';

const BoardList=({boardInfo, username})=>{

    useEffect(() => {
        axios.post(`http://localhost:3001/api/board/getMyBoards`, {userId: username})
        .then(res => {
          console.log("getting user's boards")
          console.log(res.data.boardData[2].boardData[0].b1)
          })
          .catch(err => {
            console.log(err.response)
          });
        
    }, []);


    return (
        <div className="listWrapper">
            <div className="listGrid">              
                <BoardListItem boardInfo={boardInfo} />
            </div>
        </div>
    )
}
 
export default BoardList;

