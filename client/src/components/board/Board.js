import React, { Component } from 'react';
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import './Board.css';

const ENDPOINT = "http://localhost:3001/";

export default class Board extends Component {
    constructor(props){
        super(props)

        this.state = {
            firstLoad: true,
            boardState: [],
        }
        // Canvas and color refs
        this.canvasRef = React.createRef();
        this.colorsRef = React.createRef();
    }

    componentDidMount = () => { 

        // Creating the canvas ref and context
        const canvas = this.canvasRef.current;
        const context = canvas.getContext('2d');

        // Colors link to color choices
        const colors = document.getElementsByClassName('color');
        // Setting current color (starts in black)
        const current = {
            color: 'black',
        };

        // Helper to update color choice
        const onColorUpdate = (e) => {
            current.color = e.target.className.split(' ')[1];
        };

        // Adding color event listeners
        for (let i = 0; i < colors.length; i++) {
            colors[i].addEventListener('click', onColorUpdate, false);
        }
       
        // Drawing var to denote when the user is actively drawing
        let drawing = false;       

        // drawLine(): x0 & y0 = initial point, x1 & y1 = ending point
        const drawLine = (x0, y0, x1, y1, color, mouseDown, emit, resizing) => {
            if(mouseDown){
                context.fillStyle = color;
                context.lineWidth = 3;
                context.fillRect(x0,y0,3,3);
                // Set state with previous boardState and add to it 
                this.setState({boardState: [...this.state.boardState, [x0, y0, x1, y1, color]]})
            }
            else if(resizing){
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.strokeStyle = color;
                context.lineWidth = 3;
                context.stroke();
                context.closePath();
            }
            else{
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.strokeStyle = color;
                context.lineWidth = 3;
                context.stroke();
                context.closePath();
                this.setState({boardState: [...this.state.boardState, [x0, y0, x1, y1, color]]})
            }
    
            if (!emit) { return; }
            const w = canvas.width;
            const h = canvas.height;
            
            this.props.socket.emit('drawing', {
                x0: x0,
                y0: y0,
                x1: x1,
                y1: y1,
                color: color,
                boardId: this.props.boardId,
            });
        };

// ---------------- Mouse movement ----------------

        const onMouseDown = (e) => {
            drawing = true;
            let offset = canvas.getBoundingClientRect();
            current.x = (e.clientX || e.touches[0].clientX) - offset.left;
            current.y = (e.clientY || e.touches[0].clientY) - offset.top;
            console.log(offset)
            drawLine(current.x, current.y, current.x, current.y, current.color, true, true, false);
        }

        const onMouseMove = (e) => {
            if (!drawing) { return; }
            let offset = canvas.getBoundingClientRect();
            let offsetX = offset.left;
            let offsetY = offset.top;
            drawLine(current.x, current.y, (e.clientX || e.touches[0].clientX) - offsetX, (e.clientY || e.touches[0].clientY) - offsetY, current.color, false, true, false);
            current.x = (e.clientX || e.touches[0].clientX) - offsetX;
            current.y = (e.clientY || e.touches[0].clientY) - offsetY;
        };

        const onMouseUp = (e) => {
            if (!drawing) { return; }
            drawing = false;
            context.save();
        };

// ---------------- Limit the number of events per second ----------------

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

// ---------------- Add event listeners to our canvas ----------------

        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
        canvas.addEventListener('mouseout', onMouseUp, false);
        canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

        // Touch support for mobile devices
        canvas.addEventListener('touchstart', onMouseDown, false);
        canvas.addEventListener('touchend', onMouseUp, false);
        canvas.addEventListener('touchcancel', onMouseUp, false);
        canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

// ---------------- Make the canvas fill its parent component ----------------

        const onResize = () => {
        
            let {width, height} = canvas.getBoundingClientRect();
            if(canvas.width !== width || canvas.height !== height){
                canvas.width = width;
                canvas.height = height;
            }
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width,canvas.height);
            for (var i = 0;i < this.state.boardState.length; i++) {    
                drawLine(this.state.boardState[i][0], this.state.boardState[i][1], this.state.boardState[i][2], this.state.boardState[i][3], this.state.boardState[i][4], false, false, true);
            };      
        };

        window.addEventListener('resize', onResize, false);
        onResize();
        context.fillStyle = 'white';
        context.fillRect(0, 0,canvas.width,canvas.height);

// ---------------- Socket.io connection ----------------

        const onDrawingEvent = (data) => {
            drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
        }

        this.props.socket.on('drawing',  (data) => {
            onDrawingEvent(data)
        });

// ---------------- Initialize board state ----------------

        if(this.state.firstLoad){
            let data = this.props.boardData[0].boardData;     
            for (var i = 0;i < data.length; i++) {
                drawLine(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], false);
            };
            this.setState({boardState: [...this.state.boardState, ...data], false: false})
        }
    }

// ---------------- The Canvas and color elements ----------------

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
            this.props.goBack(this.props.boardId, this.state.boardState, this.canvasRef.current); 
        }}>
        back
      </button>
      <button
        className="save"
        type="button"
        onClick={() => {
            this.props.save(this.props.boardId, this.state.boardState, this.canvasRef.current);
        }}>
        save
      </button>
    </div>
  );
}
}


