import React, {useRef, useState, useEffect} from "react";
import "./BoardListItem.css" 

const BoardListItem = ({boardInfo, author, lastModified, goToBoard}) =>{
    const [boardData, setBoardData] = useState(boardInfo);
    const [boardImage, setBoardImage] = useState(boardInfo.image)
    
    useEffect(() => {
        for (var i in boardData.boardData){
            setBoardImage(boardData.image)
        }
    }, []);

    return (
        <div className="listItem">
            <div className="imgContainer">
                <img src={boardImage} alt="No Data"/>
            </div>
            <div className="infoContainer"> 
                <p id="author"> {author} </p>
                <p id="lastModified"> {lastModified} </p>
            <button className="draw"
            type="button"
            onClick={() => goToBoard(boardData._id)}
            >
            Draw
            </button> 
            </div>
            
        </div>
    )
       
}

export default BoardListItem;