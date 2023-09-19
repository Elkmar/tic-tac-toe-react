import React from "react";
import { useState } from "react";

function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
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
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a]; //if the squares[a] is not null and the squares[a] is equal to squares[b] and the squares[a] is equal to squares[c], then we return squares[a]
    }
    return null;
}

function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {
        //we need to create a copy of the squares array, modify the copy, and then replace the squares array with the modified copy

        if (squares[i] || calculateWinner(squares)) return; //if the square is already filled, we return early by ignoring the click

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const boardTiles = () => {

        const boardRows = [];

        for (let row = 0; row < 3; row++) {
            const squareInRow = [];
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                squareInRow.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />);
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

    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isInverted, setIsInverted] = useState(false);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {

        let description;

        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }

        if (move === currentMove) {
            return (
                <li key={move}>
                    <p>You're at actually at move {move}</p>
                </li>
            );
        } else {
            return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        }
    });

    if (isInverted) {
        moves.reverse();
    }

    const inverseMoves = () => {
        setIsInverted(!isInverted);
    };

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className='game-info'>
                <button onClick={inverseMoves}>Inverse moves</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}