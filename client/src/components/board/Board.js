import React, { Component } from 'react';
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import './Board.css';

const ENDPOINT = "http://127.0.0.1:3001";

export default class Board extends Component {
    constructor(props){
        super(props)

        this.state = {
            firstLoad: true,
            boardState: [],
        }
        this.canvasRef = React.createRef();
        this.colorsRef = React.createRef();
        this.socketRef = React.createRef();
    }

    /*
    // ------------------------------- create the drawing ----------------------------
    drawLine = (x0, y0, x1, y1, color, mouseDown, emit) => {
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        if(mouseDown){
        context.fillStyle = color;
        context.lineWidth = 3;
        context.fillRect(x0,y0,3,3); // fill in the pixel at (10,10)
        this.setState({boardState: [...boardState, [x0, y0, x1, y1, color]]})
        }
        else{
        //console.log("here are the things: " + x0 + y0 + x1 + y1 + color)
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.stroke();
        context.closePath();
        this.setState({boardState: [...boardState, [x0, y0, x1, y1, color]]})
        console.log(boardState)
        }

        console.log(boardState)
        if (!emit) { return; }
        const w = canvas.width;
        const h = canvas.height;
        
        //console.log("here is boardID: " + props.boardId)
        socketRef.current.emit('drawing', {
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1,
            color: color,
            boardId: props.boardId,
        });
    };
*/

    componentDidMount = () => { 
        
        // --------------- getContext() method returns a drawing context on the canvas-----
        const canvas = this.canvasRef.current;
        //const test = this.colorsRef.current;
        const context = canvas.getContext('2d');

        // ----------------------- Colors --------------------------------------------------

        const colors = document.getElementsByClassName('color');
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
        
        const drawLine = (x0, y0, x1, y1, color, mouseDown, emit, resizing) => {
            const canvas = this.canvasRef.current;
            const context = canvas.getContext('2d');
    
            if(mouseDown){
                context.fillStyle = color;
                context.lineWidth = 3;
                context.fillRect(x0,y0,3,3); // fill in the pixel at (10,10)
                this.setState({boardState: [...this.state.boardState, [x0, y0, x1, y1, color]]})
            }
            else if(resizing){
                console.log("resizing")
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.strokeStyle = color;
                context.lineWidth = 3;
                context.stroke();
                context.closePath();
            }
            else{
                //console.log("here are the things: " + x0 + y0 + x1 + y1 + color)
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.strokeStyle = color;
                context.lineWidth = 3;
                context.stroke();
                context.closePath();
                this.setState({boardState: [...this.state.boardState, [x0, y0, x1, y1, color]]})
                console.log(this.state.boardState)
            }
    
            console.log(this.state.boardState)
            if (!emit) { return; }
            const w = canvas.width;
            const h = canvas.height;
            
            //console.log("here is boardID: " + props.boardId)
            this.socketRef.current.emit('drawing', {
                x0: x0,
                y0: y0,
                x1: x1,
                y1: y1,
                color: color,
                boardId: this.props.boardId,
            });
        };

        // ---------------- mouse movement --------------------------------------

        const onMouseDown = (e) => {

            drawing = true;
            canvas.canvasBounds = canvas.getBoundingClientRect();
            let offsetX = canvas.canvasBounds.left;
            let offsetY = canvas.canvasBounds.top;
            current.x = (e.clientX || e.touches[0].clientX) - canvas.canvasBounds.left;
            current.y = (e.clientY || e.touches[0].clientY) - canvas.canvasBounds.top;
            //console.log("x" + current.x)
            drawLine(current.x, current.y, current.x, current.y, current.color, true, true, false);
        //   if(firstLoad){
        //     console.log("here")
        //     for (var i in boardData.boardData){
        //       console.log(boardData.boardData[0].boardData[i][0])

        //       drawLine(boardData.boardData[0].boardData[i][0], boardData.boardData[0].boardData[i][1], boardData.boardData[0].boardData[i][2], boardData.boardData[0].boardData[i][3], boardData.boardData[0].boardData[i][4]);
        //     };
        //   setFirstLoad(false);      
        // }
            // let offsetX = canvasBounds.left;
            // let offsetY = canvasBounds.top;
            // console.log("mouse down");
            // current.x = (e.clientX || e.touches[0].clientX) - offsetX;
            // current.y = (e.clientY || e.touches[0].clientY) - offsetY;
        };

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            let offsetX = canvas.canvasBounds.left;
            let offsetY = canvas.canvasBounds.top;
            drawLine(current.x, current.y, (e.clientX || e.touches[0].clientX) - offsetX, (e.clientY || e.touches[0].clientY) - offsetY, current.color, false, true, false);
            current.x = (e.clientX || e.touches[0].clientX) - offsetX;
            current.y = (e.clientY || e.touches[0].clientY) - offsetY;
        };

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            drawing = false;
            let offsetX = canvas.canvasBounds.left;
            let offsetY = canvas.canvasBounds.top;
            context.save();
            console.log(context);
            // need to send the current state of the canvas to db
        };

        // ----------- limit the number of events per second -----------------------

        const throttle = (callback, delay) => {
            let previousCall = new Date().getTime();
            return function() {
            const time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
            };
        };

        // -----------------add event listeners to our canvas ----------------------

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        // Touch support for mobile devices
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

        // -------------- make the canvas fill its parent component -----------------

        const onResize = () => {
        
            let {width, height} = canvas.getBoundingClientRect();
            if(canvas.width !== width || canvas.height !== height){
                canvas.width = width;
                canvas.height = height;
            }
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width,canvas.height);
            // have to redraw canvas
            for (var i = 0;i < this.state.boardState.length; i++) {
                console.log(this.state.boardState[i][0])
                //console.log("drawing a line at: " + data[i][0])
                drawLine(this.state.boardState[i][0], this.state.boardState[i][1], this.state.boardState[i][2], this.state.boardState[i][3], this.state.boardState[i][4], false, false, true);
                //console.log(data[i][0])
            };
            
            /*
            let scaleX = window.innerWidth / canvas.width;
            let scaleY = window.innerWidth / canvas.height;
            let scaleToFit = Math.min(scaleX, scaleY);
            let scaleToCover = Math.max(scaleX, scaleY);

            canvas.style.transformOrigin = '0 0'; // scale from top left
            canvas.style.transform = 'scale(' + scaleToFit + ')';
            */
        };

        window.addEventListener('resize', onResize, false);
        onResize();
        context.fillStyle = 'white';
        context.fillRect(0, 0,canvas.width,canvas.height);

        // ----------------------- socket.io connection ----------------------------
        const onDrawingEvent = (data) => {
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
        }

        this.socketRef.current = socketIOClient(ENDPOINT);
        this.socketRef.current.on('drawing', onDrawingEvent);

        if(this.state.firstLoad){
            let data = this.props.boardData[0].boardData;
            //console.log("below is the board data")
            //console.log(data)
            //console.log("length: " + data[0][4])
            for (var i = 0;i < data.length; i++) {
            //console.log("drawing a line at: " + data[i][0])
            drawLine(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], false);
            //console.log(data[i][0])
            };
            this.setState({false: false, boardState: [...this.props.boardData[0].boardData]})
            console.log(...this.props.boardData[0].boardData)
            console.log(this.state.boardState)
            
        }
    }


  // ------------- The Canvas and color elements --------------------------
render() {
  return (
    <div className="drawing-container">
      <canvas ref={this.canvasRef} className="canvas" />
      <section ref={this.colorsRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
        <div className="color purple"/>
      </section>
      <button
                className="goBack"
                type="button"
                onClick={() => {
                  this.props.goBack(this.props.boardId); 
                  this.props.convertBoardToImage(this.canvasRef.current);
                }}>
                    back
                </button>
    </div>
  );
}
}


