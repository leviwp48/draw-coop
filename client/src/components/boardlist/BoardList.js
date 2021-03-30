import React ,{useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";

const BoardList=()=>{
    return (
        <div className="listWrapper">
            <div className="listGrid">
                <BoardListItem image=".\sephrioth.original.jpg" author="me" lastModified="11:00PM"/>
                <BoardListItem image=".\sephrioth.original.jpg" author="me" lastModified="11:00PM"/>
                <BoardListItem image=".\sephrioth.original.jpg" author="me" lastModified="11:00PM"/>
                <BoardListItem image=".\sephrioth.original.jpg" author="me" lastModified="11:00PM"/>

            </div>
        </div>
    )
}
 
export default BoardList;