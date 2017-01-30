import React from 'react';
import ReactDOM from 'react-dom';
// import Canvas from './components/board';
import {Button, ButtonsGroup, Navbar, Banner, Styles, HorizontalSplitter, Monitor, Footer} from './components/ui.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false, //become true on component's first mount
      started: false, //true when animation is runnig, false when stopped
      board: null, //2D array of cells
      width: null, //canvas width, divided by a cell size gives the total of rows
      height: 400, //canvas height, divided by a cell size gives the total of columns
      cellSize: 16, //
      uiSize: 40, //UI on at the bottom of the canvas -not implemented-
      cellShape: "square" //Optional: square or circle depending on user's choice -not implemented-
    };
    this.generations = 0;
    this.onBoardClick = this.onBoardClick.bind(this);
    this.responsiveCanvas = this.responsiveCanvas.bind(this);
    this.drawCells = this.drawCells.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
  }
  //when the component mount for the first time,
  //set the width of the canvas to match the width of the app and
  //generate a random 2D array to render 
  init() {
    if(!this.state.loaded) {
      const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width; 
      const board = this.generateRandomArray(
        width,
        this.state.height,
        this.state.cellSize,
        true
      );
      this.setState({board, loaded: true, started: true, width});
    }
  }
  
  drawGrid(width, height, space, ctx) {
    const rows = ~~(height / space);
    const cols = ~~(width / space);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        ctx.save();
        ctx.strokeStyle = "white";
        ctx.strokeRect(
          j * space,
          i * space,
          space,
          space);
        ctx.restore();
      }
    }
  }

  drawSquare(i, j, size, ctx) {
    ctx.fillRect(
      j * size,
      i * size,
      size,
      size);
  }

  drawCircle(i, j, size, ctx) {
    ctx.beginPath();
    ctx.arc(
      ~~(size * (j + 0.5)),
      ~~(size * (i + 0.5)),
      ~~(size / 2) - 1,
      0, 2 * Math.PI
    );
    ctx.fill()
    ctx.closePath();
  }

  drawCells(width, height, cellSize, ctx, board) {
    const rows = ~~(height / cellSize);
    const cols = ~~(width / cellSize);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j] === 1) {
          ctx.fillStyle = "#E74C3C";
          this.drawSquare(i, j, cellSize, ctx);
        }
      }
    }
  }
  
  generateRandomArray(width, height, cellSize, random=false) {
    const ROWS = ~~(height / cellSize);
    const COLS = ~~(width / cellSize);
    let arr = [];
    for(let i = 0; i < ROWS; i++) {
      arr[i] = [];
      for(let j = 0; j < COLS; j++) {
        let randomValue = random ? ~~(Math.random() * 2) : 0;
        arr[i][j] = randomValue;
      }
    }
    return arr;
  }

  cloneArray(arrayToClone, clone) {
    for(let i = 0; i < arrayToClone.length; i++) {
      if(Array.isArray(arrayToClone[i])) {
        clone[i] = [];
        this.cloneArray(arrayToClone[i], clone[i]);
      } else {
        clone[i] = arrayToClone[i];
      }
    }
  }

  getNeighbours(row, col, array) {
    let neighbours = [];
    for(let i = -1; i < 2; i++) {
      for(let j = -1; j < 2; j++) {
        let newI = row + i;
        let newJ = col + j;
        if(
            (newI >= 0 && newJ >= 0)
            && (newI < array.length && newJ < array[0].length) 
            && (i !== 0 || j !== 0)
          ) {
          neighbours.push(array[newI][newJ]);
        } 
      }
    }
    return neighbours;
  }

  countLiveCells() {
    let sum = 0;
    this.state.board.forEach(row => {
      row.forEach(col => {
        sum += col;
      });
    });
    return sum;
  }

  countGenerations(arr1, arr2) {
    for(let i = 0; i < arr1.length; i++) {
      for(let j = 0; j < arr1[0].length; j++) {
        if(arr1[i][j] !== arr2[i][j]){
          return 1;
        }
      }
    }
    return 0; 
  }

  onBoardClick(e) {
    if(e.target.localName === "canvas") {
      let x = e.clientX - e.target.getBoundingClientRect().left,
          y = e.clientY - e.target.getBoundingClientRect().top,
          row = ~~(y / this.state.cellSize),
          col = ~~(x / this.state.cellSize);
      var clone = [];
      this.cloneArray(this.state.board, clone);
      if(
        row >= 0 && row < clone.length &&
        col >= 0 && col < clone[0].length)
        {
          clone[row][col] = clone[row][col] === 1 ? 0 : 1;
        }
        this.setState({board: clone});
    }
    switch(e.target.innerText) {
      case "START":
        this.startAnimation();
        break;
      case "STOP":
        this.stopAnimation();
        break;
      case "CLEAR":
        this.clearBoard();
        break;
      case "RANDOM BOARD":
        this.getRandomBoard();
        break;
      default:
    }
    this.setState(prevState => this.state);
  }

  startAnimation() {
    if(!this.state.started) {
      this.timerID = setInterval(() => {
        this.update();
      }, 1000 /10 )
      this.setState({started: true});
    }
  }

  stopAnimation() {
    if(this.state.started) {
      clearInterval(this.timerID);
      this.setState({started: false});
    }
  }

  clearBoard() {
    this.stopAnimation();
    this.generations = 0;
    const board = this.generateRandomArray(
      this.state.width,
      this.state.height,
      this.state.cellSize,
    );
    this.setState({board});
  }

  getRandomBoard() {
    this.generations = 0;
    let board = this.generateRandomArray(
      this.state.width,
      this.state.height,
      this.state.cellSize,
      true
    );
    this.stopAnimation();
    this.setState({board});
  }

  update() {
    let nextArray = [];
    this.cloneArray(this.state.board, nextArray);
    for(let i = 0; i < nextArray.length; i++) {
      for(let j = 0; j < nextArray[0].length; j++) {
        let currentCell = this.state.board[i][j];
        let neighboursSum =
          this.getNeighbours(i, j, this.state.board).reduce((a, b) => a + b);
        switch(currentCell) {
          case 1:
            if(neighboursSum < 2) {
              nextArray[i][j] = 0;
            }
            if(neighboursSum > 3) {
              nextArray[i][j] = 0;
            }
            break;
          case 0:
            if(neighboursSum === 3) {
              nextArray[i][j] = 1;
            }
            break;
          default:
        }
      }
    }
    this.generations += this.countGenerations(this.state.board, nextArray);
    this.setState({board: nextArray});
  }

  //Resize the canvas
  responsiveCanvas() {
    //Get the current app width
    const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
    //If the canvas is wider expand the array,
    //first generate a wider array, then copy the current array values
    if(width > this.state.width) {
      let board = this.generateRandomArray(
        width, this.state.height, this.state.cellSize
      );
      for(let i = 0; i < this.state.board.length; i++) {
        for(let j = 0; j < this.state.board[0].length; j++) {
          board[i][j] = this.state.board[i][j];
        }
      }
      this.setState({board});
    }
    this.setState({width});
  } 

  componentDidMount() {
    this.init();
    this.timerID = setInterval(() => {
      this.update()
    }, 1000 / 10);
    window.addEventListener("resize", this.responsiveCanvas);
    window.addEventListener("click", this.onBoardClick);
  }

  shouldComponentUpdate() {
    //get a reference to the DOM canvas
    const surface = ReactDOM.findDOMNode(this).querySelector("canvas");
    surface.width = this.state.width;
    surface.height = this.state.height;
    this.ctx = surface.getContext("2d");
    //render the board state
    this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.drawCells(this.state.width, this.state.height, this.state.cellSize,this.ctx, this.state.board);
    this.drawGrid(this.state.width, this.state.height, this.state.cellSize, this.ctx);
    return true;
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    window.removeEventListener("resize", this.responsiveCanvas);
    window.removeEventListener("click", this.onBoardClick);
  }

  render() {
    return (
      <div className="container">
        <Banner appName="Conway's Game of Life"/>
        <Navbar>
          <ButtonsGroup>
            <Button name="start" color={Styles.colors.green}/>
            <Button name="stop" color={Styles.colors.red}/>
            <Button name="clear" color={Styles.colors.orange}/>
          </ButtonsGroup>
          {" "}
          <Button name="random board" color={Styles.colors.white}/>
        </Navbar>
        <HorizontalSplitter />
        <div className="row">
        <canvas
        style={{"backgroundColor": "#ECF0F1"}}
        />
        </div>
        <HorizontalSplitter />
        <div className="row text-center">
          <Monitor color="text-danger" name="Live cells" data={this.state.board ? this.countLiveCells() : 0}/>
          <Monitor color="text-info" name="Generations" data={this.generations}/>
        </div>
        <HorizontalSplitter />
        <Footer />
      </div>
    );
  }
}

export default App;
