import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ButtonToolbar, MenuItem, DropdownButton} from 'react-bootstrap';


//Button component
class Buttons extends Component{

	handleSelect=(event)=>{
		this.props.gridSize(event)
	}
	render(){
		return(
			<div className="center">
				<ButtonToolbar>
					<button className=" btn btn-primary" onClick={this.props.playButton}>Play</button>
					<button className=" btn btn-primary" onClick={this.props.pauseButton}>Pause</button>
					<button className=" btn btn-primary" onClick={this.props.clear}>Clear</button>
					<button className=" btn btn-primary" onClick={this.props.slow}>Slow</button>
					<button className=" btn btn-primary" onClick={this.props.fast}>Fast</button>
					<button className=" btn btn-primary" onClick={this.props.seed}>Seed</button>
					<DropdownButton
						title="Grid Size"
						id="menu-size"
						onSelect={this.handleSelect} className="btn btn-primary">
						<MenuItem eventKey="1">20*10</MenuItem>
						<MenuItem eventKey="2">50*30</MenuItem>
						<MenuItem eventKey="3">70*50</MenuItem>
					</DropdownButton>
				</ButtonToolbar>
			</div>
			)
	}
}


//Box component inside Grid
class Box extends Component{
	selectBox=()=>{
		this.props.selectBox(this.props.row,this.props.col)

	}


	render(){
		return(
		<div className={this.props.boxClass}
		id={this.props.boxId}
		onClick={this.selectBox} >
			
		</div>

			)
	}
}

//Grid component
class Grid extends Component{

	
	render(){
		const width = this.props.cols * 14;

		let rowsArr = [];
		let boxClass = "";
		for(var i=0;i<this.props.rows;i++){
			for(var j=0;j<this.props.cols;j++){
				const boxId = i + "_" + j;
				boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				rowsArr.push(
					<Box 
						key={boxId}
						boxId = {boxId}
						boxClass={boxClass}
						row={i}
						col={j}
						selectBox={this.props.selectBox}
					/>
				)
			}
		}
			
		
	
		return(
			<div className = "grid" style={{width:width}}>
				{rowsArr}
			</div>

			)
	}
}
const gameSettings = {
		speed: 100,
		rows:30,
		cols:50
	}

//GameofLife component
class GameofLife extends Component{
	
	
	state = {
	generations: 0,
	gridFull: Array(gameSettings.rows).fill().map(()=> Array(gameSettings.cols).fill(false))
	}

	selectBox=(row,col)=>{
		let gridCopy = [...this.state.gridFull];
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({gridFull : gridCopy});
	}

	seed=()=>{
		let gridCopy = [...this.state.gridFull];
		for(var i=0;i<gameSettings.rows;i++){
			for(var j=0;j<gameSettings.cols;j++){
		
			if(Math.round(Math.random() * 4) === 1){
				gridCopy[i][j] = true;
			}

			}
		}
		this.setState({
			gridFull: gridCopy
		})
	}

	playButton=()=>{
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play,gameSettings.speed);
	}

	pauseButton=()=>{
		clearInterval(this.intervalId);
	}
	slow = () => {
		gameSettings.speed = 1000;
		this.playButton();
	}

	fast = () => {
		gameSettings.speed = 100;
		this.playButton();
	}

	clear = () => {
		var grid = Array(gameSettings.rows).fill().map(() => Array(gameSettings.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

	gridSize = (size) => {
		switch (size) {
			case "1":
				gameSettings.cols = 20;
				gameSettings.rows = 10;
			break;
			case "2":
				gameSettings.cols = 50;
				gameSettings.rows = 30;
			break;
			default:
				gameSettings.cols = 70;
				gameSettings.rows = 50;
		}
		this.clear();

	}

	//play method and logic of the game
	play =()=>{
		let g = this.state.gridFull;
		let g2 = [...this.state.gridFull];

		for (let i = 0; i < gameSettings.rows; i++) {
		  for (let j = 0; j < gameSettings.cols; j++) {
		    let count = 0;
		    if (i > 0) if (g[i - 1][j]) count++;
		    if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
		    if (i > 0 && j < gameSettings.cols - 1) if (g[i - 1][j + 1]) count++;
		    if (j < gameSettings.cols - 1) if (g[i][j + 1]) count++;
		    if (j > 0) if (g[i][j - 1]) count++;
		    if (i < gameSettings.rows - 1) if (g[i + 1][j]) count++;
		    if (i < gameSettings.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
		    if (i < gameSettings.rows - 1 && j < gameSettings.cols - 1) if (g[i + 1][j + 1]) count++;
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
		    if (!g[i][j] && count === 3) g2[i][j] = true;
		  }
		}
		this.setState({
			gridFull:g2,
			generations: this.state.generations +1
		})
	}

	componentDidMount(){
		this.seed();
		this.playButton();
	}
	render(){

	return (
		<div>
			<h1 className="display-2">The Game of Life</h1>
			<Grid
				gridFull = {this.state.gridFull}
				rows={gameSettings.rows}
				cols = {gameSettings.rows}
				selectBox={this.selectBox}/>
			<Buttons
				playButton={this.playButton}
				pauseButton={this.pauseButton}
				slow={this.slow}
				fast={this.fast}
				clear={this.clear}
				seed={this.seed}
				gridSize={this.gridSize} />
			<h2>Generations: {this.state.generations}</h2>
		</div>
	)
	}
}


ReactDOM.render(<GameofLife/> , document.getElementById('root'));

