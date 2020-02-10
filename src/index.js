import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square (props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={()=>this.props.onClick(i)}/>
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            <div className="square-label-x">1</div>
            <div className="square-label-x">2</div>
            <div className="square-label-x">3</div>
          </div>
          <div className="board-row">
            <div className="square-label-y">1</div>
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            <div className="square-label-y">2</div>
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            <div className="square-label-y">3</div>
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
              locations: [],
          }],
          stepNumber: 0,
          xIsNext: true,
      }
    }

    jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step%2) === 0
      })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        
        const squares = current.squares.slice();
        const locations = current.locations.slice();
        
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({ 
            history: history.concat([
                {
                    squares : squares,
                    locations: locations.concat([calculateCoordinates(i)]),
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move)=>{
        /** INFO **/ console.info('STEP: ', step);
        const desc = move ? 
          `Go to move # ${move}`:
          `Go to game start`;
          
        return (
            <li key={move}>
                <button onClick={()=>this.jumpTo(move)}>{desc}</button>
            </li>
        );
      });

      const locations = history.map((step, move)=>{

          if(!step.locations || !step.locations.length) {
            return <li> Game Start. </li>;
          }

          /** INFO **/ console.info(`STEP ::`, step, step.locations[step.locations.length - 1]);
          let x,y;
          [x,y] = step.locations[step.locations.length - 1];

          const desc = `[ ${x}, ${y} ]`;
          return (
            <li key={move}>
              <div>{desc}</div>
            </li>
          );
      })


      let status;
      if(winner){
          status = `Winner: ${winner}`;
      } else {
          status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
      }
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i)=> this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            <div>
              <div>Moves: </div>
              <ol>{locations}</ol>
            </div>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateCoordinates(index) {

    /** INFO **/ console.info('CALCULATE COORDS OF', index);

    const xCoordinate = 1 + (index % 3);
    const yCoordinate = 1 + (Math.floor(index/3));

    /** INFO **/ console.info('COORDS', xCoordinate, yCoordinate);

    return [xCoordinate, yCoordinate];
  }

  function calculateWinner(squares){
      const lines = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6]
      ];

      for(let i=0; i<lines.length; i++) {
          const [a,b,c] = lines[i];
          if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
              return squares[a];
          }
      }

      return null;
  }
  