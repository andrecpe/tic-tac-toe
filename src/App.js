import React, {useState} from 'react';
import './App.css'

function Square({myid, value, onSquareClick}) {
    const el = document.querySelector("#square" + myid)
    if (el) {
        const ctx = el.getContext("2d")
        if (value === null) {
            ctx.clearRect(0, 0, el.width, el.height)
        } else {
            ctx.clearRect(0, 0, el.width, el.height)
            ctx.font = "50px Montserrat";
            ctx.fillStyle = "pink"
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(value, 40, 42)
        }
    }
    return (
        <canvas height="80" width="80" onClick={onSquareClick} id={'square' + myid}/>
    );
}

function Board({xIsNext, squares, onPlay}) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        const nSquare = document.querySelector("#square" + i)

        let ctx = nSquare.getContext("2d");
        ctx.font = "50px Montserrat";
        ctx.fillStyle = "pink"
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (xIsNext) {
            nextSquares[i] = 'X';
            ctx.fillText('X', 40, 42);
        } else {
            nextSquares[i] = 'O';
            ctx.fillText('O', 40, 42);
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Vencedor: ' + winner;
    } else {
        status = 'Próximo jogador: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <>
            <div className="d-flex justify-content-center mt-2">
                <Square myid={0} value={squares[0]} onSquareClick={() => handleClick(0)}/>
                <Square myid={1} value={squares[1]} onSquareClick={() => handleClick(1)}/>
                <Square myid={2} value={squares[2]} onSquareClick={() => handleClick(2)}/>
            </div>
            <div className="d-flex justify-content-center">
                <Square myid={3} value={squares[3]} onSquareClick={() => handleClick(3)}/>
                <Square myid={4} value={squares[4]} onSquareClick={() => handleClick(4)}/>
                <Square myid={5} value={squares[5]} onSquareClick={() => handleClick(5)}/>
            </div>
            <div className="d-flex justify-content-center">
                <Square myid={6} value={squares[6]} onSquareClick={() => handleClick(6)}/>
                <Square myid={7} value={squares[7]} onSquareClick={() => handleClick(7)}/>
                <Square myid={8} value={squares[8]} onSquareClick={() => handleClick(8)}/>
            </div>
            <div className="status my-2 display-6">{status}</div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
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
            description = 'Movimento #' + move;
        } else {
            description = 'Reiniciar!';
        }
        return (
            <button type="button" onClick={() => jumpTo(move)} className="btn btn-primary btn-sm mb-1"
                    key={move} style={{width:120}}>{description}</button>
        );
    });

    return (
        <>
            <div>
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="d-flex flex-column align-items-center">{moves}</div>
        </>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const vitoria = (quadrado, desenho) => {
        quadrado.forEach(num => {
            let el = document.querySelector("#square" + num)
            let ctx = el.getContext("2d")
            ctx.lineWidth = 4
            ctx.strokeStyle = "hotpink"
            ctx.beginPath()
            if (desenho === 'h') {
                if (num === 1 || num === 4 || num === 7) {
                    ctx.moveTo(0, 40)
                    ctx.lineTo(80, 40)
                } else if (num === 0 || num === 3 || num === 6) {
                    ctx.moveTo(5, 40)
                    ctx.lineTo(80, 40)
                } else if (num === 2 || num === 5 || num === 8) {
                    ctx.moveTo(0, 40)
                    ctx.lineTo(75, 40)
                }
            }
            if (desenho === 'v') {
                if (num === 3 || num === 4 || num === 5) {
                    ctx.moveTo(40, 0)
                    ctx.lineTo(40, 80)
                } else if (num === 0 || num === 1 || num === 2) {
                    ctx.moveTo(40, 5)
                    ctx.lineTo(40, 80)
                } else if (num === 6 || num === 7 || num === 8) {
                    ctx.moveTo(40, 0)
                    ctx.lineTo(40, 75)
                }
            }
            if (desenho === 'd1') {
                if (num === 4) {
                    ctx.moveTo(0, 0)
                    ctx.lineTo(80, 80)
                } else if (num === 0) {
                    ctx.moveTo(6, 6)
                    ctx.lineTo(80, 80)
                } else if (num === 8) {
                    ctx.moveTo(0, 0)
                    ctx.lineTo(74, 74)
                }
            }
            if (desenho === 'd2') {
                if (num === 4) {
                    ctx.moveTo(80, 0)
                    ctx.lineTo(0, 80)
                } else if (num === 2) {
                    ctx.moveTo(74, 6)
                    ctx.lineTo(0, 80)
                } else if (num === 6) {
                    ctx.moveTo(80, 0)
                    ctx.lineTo(6, 74)
                }
            }
            ctx.stroke()
        })
    }
    const desenhos = [
        'h',
        'h',
        'h',
        'v',
        'v',
        'v',
        'd1',
        'd2'
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            setTimeout(() => {
                vitoria(lines[i], desenhos[i])
            }, 700)
            return squares[a];
        }
    }
    return null;
}