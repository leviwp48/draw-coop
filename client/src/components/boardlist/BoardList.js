import React ,{useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";
import sephImage from "./sephrioth.original.jpg";


const BoardList=()=>{
    return (
        <div className="listWrapper">
            <div className="listGrid">
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
            </div>
        </div>
    )
}
 
export default BoardList;