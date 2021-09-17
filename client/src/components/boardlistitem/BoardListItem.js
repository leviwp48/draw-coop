import React, {Component} from "react";
import "./BoardListItem.css" 

export default class BoardListItem extends Component {
    constructor(props){
        super (props)
        this.state = {
            boardData: this.props.boardInfo
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        for (var i in this.state.boardData){
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = 222;
            canvas.height = 222;
            console.log(JSON.stringify(this.props.boardInfo));
            ctx.drawImage(this.props.boardInfo.image.src, 200,200);
            //setBoardImage(canvas.toDataURL())
        }
    };

    render() {
        return (
            <div className="listItem">
                <div className="imgContainer">
                    <canvas ref={this.canvasRef} className="canvas" />      
                </div>
                <div className="infoContainer"> 
                    <p id="author"> {this.props.author} </p>
                    <p id="lastModified"> {this.props.lastModified} </p>
                <button className="draw"
                type="button"
                onClick={() => this.props.goToBoard(this.state.boardData._id)}
                >
                Draw
                </button> 
                </div>
                
            </div>
        );
    } 
}

//                <img src={boardImage} alt="No Data"/>
