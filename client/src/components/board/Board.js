import React, { Component } from 'react';
import io from 'socket.io-client';
import socketIOClient from "socket.io-client";
import './Board.css';

const ENDPOINT = "https://drawmuch.herokuapp.com/";

export default class Board extends Component {
    constructor(props){
        super(props)

        this.state = {
            firstLoad: true,
            boardState: [],
        }
        this.canvasRef = React.createRef();
        this.colorsRef = React.createRef();
        //this.socketRef = React.createRef();
    }

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
    
            if(mouseDown){
                context.fillStyle = color;
                context.lineWidth = 3;
                context.fillRect(x0,y0,3,3); // fill in the pixel at (10,10)
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
            
            //this.socketRef.current.emit('drawing', {
            this.props.socket.emit('drawing', {
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
        }

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
            console.log('redarwing board')
            for (var i = 0;i < this.state.boardState.length; i++) {    
                console.log(this.state.boardState[i][0])
                drawLine(this.state.boardState[i][0], this.state.boardState[i][1], this.state.boardState[i][2], this.state.boardState[i][3], this.state.boardState[i][4], false, false, true);
            };      
        };

        window.addEventListener('resize', onResize, false);
        onResize();
        context.fillStyle = 'white';
        context.fillRect(0, 0,canvas.width,canvas.height);

        // ----------------------- socket.io connection ----------------------------
        const onDrawingEvent = (data) => {
            const w = canvas.width;
            const h = canvas.height;
            drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
        }

        ///this.socketRef.current = this.props.socket;
        this.props.socket.on('drawing',  (data) => {
            console.log("drawing data: " + JSON.stringify(data))
            onDrawingEvent(data)
            console.log(this.props.socket.rooms)
        });

        if(this.state.firstLoad){
            let data = this.props.boardData[0].boardData;     
            for (var i = 0;i < data.length; i++) {
                drawLine(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], false);
            };
            this.setState({boardState: [...this.state.boardState, ...data], false: false})
            //console.log(...this.props.boardData[0].boardData)
            //console.log(this.state.boardState)
            
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


