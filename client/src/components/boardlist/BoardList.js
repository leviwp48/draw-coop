import React ,{useEffect, useRef, useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";
import axios from 'axios';

const BoardList=({getTokenStatus, username, goToBoard})=>{

    const[dataLoaded, setDataLoaded] = useState(false)
    const[boardInfo, setBoardInfo] = useState()
    const[numOfBoards, setNumOfBoards] = useState(0)

    useEffect(() => {
        axios.post(`http://localhost:3001/api/board/getMyBoards`, {userId: username})
        .then(res => {
          //console.log("getting user's boards: " + res.data.boardData[2].boardData[0])       
          setBoardInfo(res.data.boardData)
          setNumOfBoards(res.data.boardData.length)
          setDataLoaded(true)
          })
          .catch(err => {
            console.log(err.response)
          });
        
    }, []);


    if(dataLoaded){
        return (
            <div>
                <div className="listWrapper">
                    <div className="listGrid">
                        {boardInfo.map((board, id) => 
                            <BoardListItem boardInfo={board} key={id} goToBoard={goToBoard}/>
                        )}  
                    </div>
                    
                </div>
                
                <button
                className="createBoard"
                type="button"
                onClick={() => this.createBoard()}
                >
                    create board
                </button>
            </div>
            
        )
    }
    else{
        return(
            <div className="listWrapper">
            <div className="listGrid">     
                No Boards Found
            </div>
            <button
            className="createBoard"
            type="button"
            onClick={() => this.createBoard()}
            >
                create board
            </button>
        </div>
        )
    }
    
}
 
export default BoardList;

