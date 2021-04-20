import React ,{useEffect, useRef, useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";
import axios from 'axios';

const BoardList=({getTokenStatus, username})=>{

    const[dataLoaded, setDataLoaded] = useState(false)
    const[boardInfo, setBoardInfo] = useState()

    useEffect(() => {
        axios.post(`http://localhost:3001/api/board/getMyBoards`, {userId: username})
        .then(res => {
          console.log("getting user's boards")         
          setBoardInfo(res.data.boardData)
          console.log(boardInfo)
          setDataLoaded(true)
          })
          .catch(err => {
            console.log(err.response)
          });
        
    }, []);


    if(dataLoaded){
        
        return (
            <div className="listWrapper">
                <div className="listGrid">  
                    <BoardListItem boardInfo={boardInfo}/>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className="listWrapper">
            <div className="listGrid">     
                you must wait        
            </div>
        </div>
        )
    }
    
}
 
export default BoardList;

