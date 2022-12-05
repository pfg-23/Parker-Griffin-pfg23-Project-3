import React, { useState } from 'react';
import './style.css';

function Board() {
  const [data, setData] = useState([
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '']
  ]);

  let visited = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false]
  ];

  let gameOver = false;
  let mines = 10;

  function setUpBoard() {
    for (let i = 0; i < 10; i++) {
      let placed = false;
      while (!placed) {
        let x = Math.floor(Math.random() * 9);
        let y = Math.floor(Math.random() * 9);
        if (data[x][y] === '') {
          data[x][y] = 'X';
          placed = true;
        }
      }
    }
    calculateNeighbors()
  }

  function calculateNeighbors() {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] === '') {
          let count = 0
          if (isValidPosition(i - 1, j - 1) && data[i - 1][j - 1] === 'X')
            count++
          if (isValidPosition(i - 1, j) && data[i - 1][j] === 'X')
            count++
          if (isValidPosition(i - 1, j + 1) && data[i - 1][j + 1] === 'X')
            count++
          if (isValidPosition(i, j - 1) && data[i][j - 1] === 'X')
            count++
          if (isValidPosition(i, j + 1) && data[i][j + 1] === 'X')
            count++
          if (isValidPosition(i + 1, j - 1) && data[i + 1][j - 1] === 'X')
            count++
          if (isValidPosition(i + 1, j) && data[i + 1][j] === 'X')
            count++
          if (isValidPosition(i + 1, j + 1) && data[i + 1][j + 1] === 'X')
            count++
          data[i][j] = count
        }
      }
    }
  }

  function isValidPosition(r, c) {
    if (r < 0 || c < 0 || r > 8 || c > 8) {
      return false
    }
    return true
  }

  function reveal(e, r, c) {
    visited[r][c] = true
    let square = document.getElementById("cell_" + r + "_" + c)
    if (!gameOver && !square.classList.contains("flagged")) {
      square.classList.remove("hidden")
      square.classList.add("revealed")
      if (data[r][c] === "X") {
        square.classList.add("mine")
        revealAllMines()
        gameOver = true
        document.getElementById("gametext").innerHTML = "You lose! Refresh to try again."
      }
      else if (data[r][c] !== 0) {
        square.innerText = data[r][c]
        square.classList.add("type-" + data[r][c])
        if (wonGame()) {
          document.getElementById("gametext").innerHTML = "You win! Refresh to play again."
        }
      }
      else {
        const coords = square.id.split("_")
        const r = parseInt(coords[1])
        const c = parseInt(coords[2])
        if (isValidPosition(r - 1, c - 1) && !visited[r - 1][c - 1]) {
          reveal(e, r - 1, c - 1)
        }
        if (isValidPosition(r - 1, c) && !visited[r - 1][c]) {
          reveal(e, r - 1, c)
        }
        if (isValidPosition(r - 1, c + 1) && !visited[r - 1][c + 1]) {
          reveal(e, r - 1, c + 1)
        }
        if (isValidPosition(r, c - 1) && !visited[r][c - 1]) {
          reveal(e, r, c - 1)
        }
        if (isValidPosition(r, c + 1) && !visited[r][c + 1]) {
          reveal(e, r, c + 1)
        }
        if (isValidPosition(r + 1, c - 1) && !visited[r + 1][c - 1]) {
          reveal(e, r + 1, c - 1)
        }
        if (isValidPosition(r + 1, c) && !visited[r + 1][c]) {
          reveal(e, r + 1, c)
        }
        if (isValidPosition(r + 1, c + 1) && !visited[r + 1][c + 1]) {
          reveal(e, r + 1, c + 1)
        }
      }
    }
  }

  function flag(e, r, c) {
    e.preventDefault()
    if (!gameOver) {
      let square = document.getElementById("cell_" + r + "_" + c)
      let remainingText = document.getElementById("remaining")
      if (square.classList.contains("flagged")) {
        square.classList.remove("flagged")
        mines = mines + 1
      }
      else if (square.classList.contains("hidden")){
        square.classList.add("flagged")
        mines = mines - 1
      }
      remainingText.innerHTML = "Mines remaining: " + mines
    }
  }

  function wonGame() {
    for (let i = 0; i < visited.length; i++) {
      for (let j = 0; j < visited[i].length; j++) {
        if (!visited[i][j] && data[i][j] !== "X")
          return false;
      }
    }
    gameOver = true
    return true
  }

  function revealAllMines() {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] === "X" && !document.getElementById("cell_" + i + "_" + j).classList.contains("mine")) {
          document.getElementById("cell_" + i + "_" + j).classList.add("mine")
        }
      }
    }
  }

  setUpBoard()
  return (
    <div className="board">
      <h2>Minesweeper</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <td id="cell_0_0" className="square hidden" onClick={(e) => reveal(e, 0, 0)} onContextMenu={(e) => flag(e, 0, 0)}></td>
              <td id="cell_0_1" className="square hidden" onClick={(e) => reveal(e, 0, 1)} onContextMenu={(e) => flag(e, 0, 1)}></td>
              <td id="cell_0_2" className="square hidden" onClick={(e) => reveal(e, 0, 2)} onContextMenu={(e) => flag(e, 0, 2)}></td>
              <td id="cell_0_3" className="square hidden" onClick={(e) => reveal(e, 0, 3)} onContextMenu={(e) => flag(e, 0, 3)}></td>
              <td id="cell_0_4" className="square hidden" onClick={(e) => reveal(e, 0, 4)} onContextMenu={(e) => flag(e, 0, 4)}></td>
              <td id="cell_0_5" className="square hidden" onClick={(e) => reveal(e, 0, 5)} onContextMenu={(e) => flag(e, 0, 5)}></td>
              <td id="cell_0_6" className="square hidden" onClick={(e) => reveal(e, 0, 6)} onContextMenu={(e) => flag(e, 0, 6)}></td>
              <td id="cell_0_7" className="square hidden" onClick={(e) => reveal(e, 0, 7)} onContextMenu={(e) => flag(e, 0, 7)}></td>
              <td id="cell_0_8" className="square hidden" onClick={(e) => reveal(e, 0, 8)} onContextMenu={(e) => flag(e, 0, 8)}></td>
            </tr>
            <tr>
              <td id="cell_1_0" className="square hidden" onClick={(e) => reveal(e, 1, 0)} onContextMenu={(e) => flag(e, 1, 0)}></td>
              <td id="cell_1_1" className="square hidden" onClick={(e) => reveal(e, 1, 1)} onContextMenu={(e) => flag(e, 1, 1)}></td>
              <td id="cell_1_2" className="square hidden" onClick={(e) => reveal(e, 1, 2)} onContextMenu={(e) => flag(e, 1, 2)}></td>
              <td id="cell_1_3" className="square hidden" onClick={(e) => reveal(e, 1, 3)} onContextMenu={(e) => flag(e, 1, 3)}></td>
              <td id="cell_1_4" className="square hidden" onClick={(e) => reveal(e, 1, 4)} onContextMenu={(e) => flag(e, 1, 4)}></td>
              <td id="cell_1_5" className="square hidden" onClick={(e) => reveal(e, 1, 5)} onContextMenu={(e) => flag(e, 1, 5)}></td>
              <td id="cell_1_6" className="square hidden" onClick={(e) => reveal(e, 1, 6)} onContextMenu={(e) => flag(e, 1, 6)}></td>
              <td id="cell_1_7" className="square hidden" onClick={(e) => reveal(e, 1, 7)} onContextMenu={(e) => flag(e, 1, 7)}></td>
              <td id="cell_1_8" className="square hidden" onClick={(e) => reveal(e, 1, 8)} onContextMenu={(e) => flag(e, 1, 8)}></td>
            </tr>
            <tr>
              <td id="cell_2_0" className="square hidden" onClick={(e) => reveal(e, 2, 0)} onContextMenu={(e) => flag(e, 2, 0)}></td>
              <td id="cell_2_1" className="square hidden" onClick={(e) => reveal(e, 2, 1)} onContextMenu={(e) => flag(e, 2, 1)}></td>
              <td id="cell_2_2" className="square hidden" onClick={(e) => reveal(e, 2, 2)} onContextMenu={(e) => flag(e, 2, 2)}></td>
              <td id="cell_2_3" className="square hidden" onClick={(e) => reveal(e, 2, 3)} onContextMenu={(e) => flag(e, 2, 3)}></td>
              <td id="cell_2_4" className="square hidden" onClick={(e) => reveal(e, 2, 4)} onContextMenu={(e) => flag(e, 2, 4)}></td>
              <td id="cell_2_5" className="square hidden" onClick={(e) => reveal(e, 2, 5)} onContextMenu={(e) => flag(e, 2, 5)}></td>
              <td id="cell_2_6" className="square hidden" onClick={(e) => reveal(e, 2, 6)} onContextMenu={(e) => flag(e, 2, 6)}></td>
              <td id="cell_2_7" className="square hidden" onClick={(e) => reveal(e, 2, 7)} onContextMenu={(e) => flag(e, 2, 7)}></td>
              <td id="cell_2_8" className="square hidden" onClick={(e) => reveal(e, 2, 8)} onContextMenu={(e) => flag(e, 2, 8)}></td>
            </tr>
            <tr>
              <td id="cell_3_0" className="square hidden" onClick={(e) => reveal(e, 3, 0)} onContextMenu={(e) => flag(e, 3, 0)}></td>
              <td id="cell_3_1" className="square hidden" onClick={(e) => reveal(e, 3, 1)} onContextMenu={(e) => flag(e, 3, 1)}></td>
              <td id="cell_3_2" className="square hidden" onClick={(e) => reveal(e, 3, 2)} onContextMenu={(e) => flag(e, 3, 2)}></td>
              <td id="cell_3_3" className="square hidden" onClick={(e) => reveal(e, 3, 3)} onContextMenu={(e) => flag(e, 3, 3)}></td>
              <td id="cell_3_4" className="square hidden" onClick={(e) => reveal(e, 3, 4)} onContextMenu={(e) => flag(e, 3, 4)}></td>
              <td id="cell_3_5" className="square hidden" onClick={(e) => reveal(e, 3, 5)} onContextMenu={(e) => flag(e, 3, 5)}></td>
              <td id="cell_3_6" className="square hidden" onClick={(e) => reveal(e, 3, 6)} onContextMenu={(e) => flag(e, 3, 6)}></td>
              <td id="cell_3_7" className="square hidden" onClick={(e) => reveal(e, 3, 7)} onContextMenu={(e) => flag(e, 3, 7)}></td>
              <td id="cell_3_8" className="square hidden" onClick={(e) => reveal(e, 3, 8)} onContextMenu={(e) => flag(e, 3, 8)}></td>
            </tr>
            <tr>
              <td id="cell_4_0" className="square hidden" onClick={(e) => reveal(e, 4, 0)} onContextMenu={(e) => flag(e, 4, 0)}></td>
              <td id="cell_4_1" className="square hidden" onClick={(e) => reveal(e, 4, 1)} onContextMenu={(e) => flag(e, 4, 1)}></td>
              <td id="cell_4_2" className="square hidden" onClick={(e) => reveal(e, 4, 2)} onContextMenu={(e) => flag(e, 4, 2)}></td>
              <td id="cell_4_3" className="square hidden" onClick={(e) => reveal(e, 4, 3)} onContextMenu={(e) => flag(e, 4, 3)}></td>
              <td id="cell_4_4" className="square hidden" onClick={(e) => reveal(e, 4, 4)} onContextMenu={(e) => flag(e, 4, 4)}></td>
              <td id="cell_4_5" className="square hidden" onClick={(e) => reveal(e, 4, 5)} onContextMenu={(e) => flag(e, 4, 5)}></td>
              <td id="cell_4_6" className="square hidden" onClick={(e) => reveal(e, 4, 6)} onContextMenu={(e) => flag(e, 4, 6)}></td>
              <td id="cell_4_7" className="square hidden" onClick={(e) => reveal(e, 4, 7)} onContextMenu={(e) => flag(e, 4, 7)}></td>
              <td id="cell_4_8" className="square hidden" onClick={(e) => reveal(e, 4, 8)} onContextMenu={(e) => flag(e, 4, 8)}></td>
            </tr>
            <tr>
              <td id="cell_5_0" className="square hidden" onClick={(e) => reveal(e, 5, 0)} onContextMenu={(e) => flag(e, 5, 0)}></td>
              <td id="cell_5_1" className="square hidden" onClick={(e) => reveal(e, 5, 1)} onContextMenu={(e) => flag(e, 5, 1)}></td>
              <td id="cell_5_2" className="square hidden" onClick={(e) => reveal(e, 5, 2)} onContextMenu={(e) => flag(e, 5, 2)}></td>
              <td id="cell_5_3" className="square hidden" onClick={(e) => reveal(e, 5, 3)} onContextMenu={(e) => flag(e, 5, 3)}></td>
              <td id="cell_5_4" className="square hidden" onClick={(e) => reveal(e, 5, 4)} onContextMenu={(e) => flag(e, 5, 4)}></td>
              <td id="cell_5_5" className="square hidden" onClick={(e) => reveal(e, 5, 5)} onContextMenu={(e) => flag(e, 5, 5)}></td>
              <td id="cell_5_6" className="square hidden" onClick={(e) => reveal(e, 5, 6)} onContextMenu={(e) => flag(e, 5, 6)}></td>
              <td id="cell_5_7" className="square hidden" onClick={(e) => reveal(e, 5, 7)} onContextMenu={(e) => flag(e, 5, 7)}></td>
              <td id="cell_5_8" className="square hidden" onClick={(e) => reveal(e, 5, 8)} onContextMenu={(e) => flag(e, 5, 8)}></td>
            </tr>
            <tr>
              <td id="cell_6_0" className="square hidden" onClick={(e) => reveal(e, 6, 0)} onContextMenu={(e) => flag(e, 6, 0)}></td>
              <td id="cell_6_1" className="square hidden" onClick={(e) => reveal(e, 6, 1)} onContextMenu={(e) => flag(e, 6, 1)}></td>
              <td id="cell_6_2" className="square hidden" onClick={(e) => reveal(e, 6, 2)} onContextMenu={(e) => flag(e, 6, 2)}></td>
              <td id="cell_6_3" className="square hidden" onClick={(e) => reveal(e, 6, 3)} onContextMenu={(e) => flag(e, 6, 3)}></td>
              <td id="cell_6_4" className="square hidden" onClick={(e) => reveal(e, 6, 4)} onContextMenu={(e) => flag(e, 6, 4)}></td>
              <td id="cell_6_5" className="square hidden" onClick={(e) => reveal(e, 6, 5)} onContextMenu={(e) => flag(e, 6, 5)}></td>
              <td id="cell_6_6" className="square hidden" onClick={(e) => reveal(e, 6, 6)} onContextMenu={(e) => flag(e, 6, 6)}></td>
              <td id="cell_6_7" className="square hidden" onClick={(e) => reveal(e, 6, 7)} onContextMenu={(e) => flag(e, 6, 7)}></td>
              <td id="cell_6_8" className="square hidden" onClick={(e) => reveal(e, 6, 8)} onContextMenu={(e) => flag(e, 6, 8)}></td>
            </tr>
            <tr>
              <td id="cell_7_0" className="square hidden" onClick={(e) => reveal(e, 7, 0)} onContextMenu={(e) => flag(e, 7, 0)}></td>
              <td id="cell_7_1" className="square hidden" onClick={(e) => reveal(e, 7, 1)} onContextMenu={(e) => flag(e, 7, 1)}></td>
              <td id="cell_7_2" className="square hidden" onClick={(e) => reveal(e, 7, 2)} onContextMenu={(e) => flag(e, 7, 2)}></td>
              <td id="cell_7_3" className="square hidden" onClick={(e) => reveal(e, 7, 3)} onContextMenu={(e) => flag(e, 7, 3)}></td>
              <td id="cell_7_4" className="square hidden" onClick={(e) => reveal(e, 7, 4)} onContextMenu={(e) => flag(e, 7, 4)}></td>
              <td id="cell_7_5" className="square hidden" onClick={(e) => reveal(e, 7, 5)} onContextMenu={(e) => flag(e, 7, 5)}></td>
              <td id="cell_7_6" className="square hidden" onClick={(e) => reveal(e, 7, 6)} onContextMenu={(e) => flag(e, 7, 6)}></td>
              <td id="cell_7_7" className="square hidden" onClick={(e) => reveal(e, 7, 7)} onContextMenu={(e) => flag(e, 7, 7)}></td>
              <td id="cell_7_8" className="square hidden" onClick={(e) => reveal(e, 7, 8)} onContextMenu={(e) => flag(e, 7, 8)}></td>
            </tr>
            <tr>
              <td id="cell_8_0" className="square hidden" onClick={(e) => reveal(e, 8, 0)} onContextMenu={(e) => flag(e, 8, 0)}></td>
              <td id="cell_8_1" className="square hidden" onClick={(e) => reveal(e, 8, 1)} onContextMenu={(e) => flag(e, 8, 1)}></td>
              <td id="cell_8_2" className="square hidden" onClick={(e) => reveal(e, 8, 2)} onContextMenu={(e) => flag(e, 8, 2)}></td>
              <td id="cell_8_3" className="square hidden" onClick={(e) => reveal(e, 8, 3)} onContextMenu={(e) => flag(e, 8, 3)}></td>
              <td id="cell_8_4" className="square hidden" onClick={(e) => reveal(e, 8, 4)} onContextMenu={(e) => flag(e, 8, 4)}></td>
              <td id="cell_8_5" className="square hidden" onClick={(e) => reveal(e, 8, 5)} onContextMenu={(e) => flag(e, 8, 5)}></td>
              <td id="cell_8_6" className="square hidden" onClick={(e) => reveal(e, 8, 6)} onContextMenu={(e) => flag(e, 8, 6)}></td>
              <td id="cell_8_7" className="square hidden" onClick={(e) => reveal(e, 8, 7)} onContextMenu={(e) => flag(e, 8, 7)}></td>
              <td id="cell_8_8" className="square hidden" onClick={(e) => reveal(e, 8, 8)} onContextMenu={(e) => flag(e, 8, 8)}></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <p id="remaining">
          Mines remaining: 10
        </p>
      </div>
      <div>
        <p id="gametext">
  
        </p>
      </div>
    </div>
  );
}

export default Board;
