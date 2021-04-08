import React ,{useEffect, useRef, useState} from "react";
import "./BoardListItem.css" 

const BoardListItem = ({boardInfo, author, lastModified}) =>{
    const [boardData, setBoardData] = useState(boardInfo);
    const canvasRef = useRef(null);
    const colorsRef = useRef(null);
    const socketRef = useRef();
    
    useEffect(() => {

        const canvas = canvasRef.current;
        const test = colorsRef.current;
        const context = canvas.getContext('2d');
      
        let drawing = false;

        const drawLine = (x0, y0, x1, y1, color, emit) => {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.stroke();
            context.closePath(); 
        };

        const onResize = () => {
        let {width, height} = canvas.getBoundingClientRect();
        if(canvas.width !== width || canvas.height !== height){
            canvas.width = width;
            canvas.height = height;
            }
        };

        window.addEventListener('resize', onResize, false);
        onResize();
        
        const w = canvas.width;
        const h = canvas.height;
        console.log("got this thing here: " + boardInfo)
        //drawLine(boardInfo.b1[0].x0, boardInfo.b1[0].y0, boardInfo.b1[0].x1, boardInfo.b1[0].y1, boardInfo.b1[0].color);
       // drawLine(boardInfo.b2[0].x0, boardInfo.b2[0].y0, boardInfo.b2[0].x1, boardInfo.b2[0].y1, boardInfo.b2[0].color);
        console.log("drew the line dude")

    }, []);

    return (
        <div className="listItem">
            <div className="imgContainer">
                <canvas ref={canvasRef} className="canvas" />
            </div>
            <div className="infoContainer"> 
                <p id="author"> {author} </p>
                <p id="lastModified"> {lastModified} </p>
                <button className="goToBoard"
            type="button"
            onClick={() => this.goToBoard()}
          >
          go to board
          </button> 
            </div>
            
        </div>
    )
}
 
export default BoardListItem;