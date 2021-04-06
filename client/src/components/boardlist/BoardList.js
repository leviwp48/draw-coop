import React ,{useEffect, useRef, useState} from "react";
import "./BoardList.css" 
import BoardListItem from "../boardlistitem/BoardListItem";
import sephImage from "./sephrioth.original.jpg";

const BoardList=({image, author, lastModified})=>{

    return (
        <div className="listWrapper">
            <div className="listGrid">
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
                <BoardListItem image={sephImage} author="me" lastModified="11:00PM"/>
            </div>
        </div>
    )
}
 
export default BoardList;

//                <BoardListItem image={this.props.image} author={this.props.author} lastModified={this.props.lastModified}/>
