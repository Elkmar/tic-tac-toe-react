import React from "react";
import { useState } from "react";

function Square({value, onSquareClick, highlight}) {
    return <button className={`square ${highlight ? "highlight" : ""}`}  onClick={onSquareClick}>{value}</button>;
}

function calculateWinner(squares) {
    const winningLines = [
        [0, 1, 2], //horizontal
        [3, 4, 5], //horizontal
        [6, 7, 8], //horizontal
        [0, 3, 6], //vertical
        [1, 4, 7], //vertical
        [2, 5, 8], //vertical
        [0, 4, 8], //diagonal
        [2, 4, 6] //diagonal
    ];
    for (let i = 0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c]; //if the squares[a] is not null and the squares[a] is equal to squares[b] and the squares[a] is equal to squares[c], then we return squares[a]
        }
    }
    return null;
}

function Board({xIsNext, squares, onPlay, winningSquares}) {

    function handleClick(i) {
        //we need to create a copy of the squares array, modify the copy, and then replace the squares array with the modified copy

        if (squares[i] || calculateWinner(squares)) return; //if the square is already filled, we return early by ignoring the click

        const nextSquares = squares.slice();

        nextSquares[i] = xIsNext ? "X" : "O";
        
        //we need to calculate the row and col of the square that was clicked in order to display it in the move history
        const row = Math.floor(i / 3) + 1;
        const col = (i % 3) + 1;
        onPlay(nextSquares, { row, col });
    }
    
    let status;

    if (winningSquares) {
        status = "Winner: " + squares[winningSquares[0]];
    } else if (!squares.includes(null)) {
        status = "Draw";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const boardTiles = () => {

        const boardRows = [];

        for (let row = 0; row < 3; row++) {

            const squareInRow = [];

            for (let col = 0; col < 3; col++) {

                const index = row * 3 + col;
                const isWinningSquare = winningSquares && winningSquares.includes(index);

                squareInRow.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} highlight={isWinningSquare} />);
            }
            boardRows.push(<div key={row} className="board-row">{squareInRow}</div>);
        }

        return boardRows;
    };

    return (
        <React.Fragment>
            <div className="status">{status}</div>
            {boardTiles()}
        </React.Fragment>
    );
}

export default function Game() {

    const [history, setHistory] = useState([{ squares: Array(9).fill(null), coordinates: null }]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isInverted, setIsInverted] = useState(false);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares, coordinates) {
        const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares, coordinates }]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }    

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move + (step.coordinates ? ` (${step.coordinates.row}, ${step.coordinates.col})` : '') :
            'Go to game start';
        
        return (
            <li key={move}>
                <button className={move === currentMove ? 'move-list-item-selected' : ''} onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });
        
    if (isInverted) {
        moves.reverse();
    }

    const inverseMoves = () => {
        setIsInverted(!isInverted);
    };

    const winningSquares = calculateWinner(currentSquares);

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
            </div>
            <div className='game-info'>
                <button onClick={inverseMoves}>Inverse moves</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}