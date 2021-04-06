import React ,{useEffect, useRef, useState} from "react";
import "./BoardListItem.css" 

const BoardListItem = ({image, author, lastModified}) =>{
 
    const canvasRef = useRef(null);
    const colorsRef = useRef(null);
    const socketRef = useRef();

    const draw = ctx => {
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20, 0, 2*Math.PI)
    ctx.fill()
    }
    useEffect(() => {

        const canvas = canvasRef.current;
        const test = colorsRef.current;
        const context = canvas.getContext('2d');

        // ----------------------- Colors --------------------------------------------------

        const colors = document.getElementsByClassName('color');
        console.log(colors, 'the colors');
        console.log(test);
        // set the current color
        const current = {
            color: 'black',
        };

        // helper that will update the current color
        const onColorUpdate = (e) => {
            current.color = e.target.className.split(' ')[1];
        };

        // loop through the color elements and add the click event listeners
        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener('click', onColorUpdate, false);
        }
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
    }, []);

    return (
        <div className="listItem">
            <div className="imgContainer">
                <canvas ref={canvasRef} className="canvas" />
            </div>
            <div className="infoContainer"> 
                <p id="author"> {author} </p>
                <p id="lastModified"> {lastModified} </p>
            </div>
        </div>
    )
}
 
export default BoardListItem;