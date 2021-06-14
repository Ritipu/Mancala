import { createSlice } from '@reduxjs/toolkit';

export function checkIfCurrentPlayer(line, column, currentPlayer) {
	return (currentPlayer === 0 && line === 0 && column < 7)
		|| (currentPlayer === 1 && ((line === 0 && column === 7) || line === 1))
}
function getPositionAhead(line, column) {
	return {
		line: (line + 1) % 2,
		column: line === 0 ? column - 1 : column + 1
	}
}

function getMancalaPosition(player) {
	return {
		line: 0,
		column: player === 1 ? 7 : 0
	}
}

function getNextPlayer(player) {
	return player === 1 ? 0 : 1
}

function distributePieces(board, line, column) {
	let count = board[line][column];
	const player = line;
	const mancalaPosition = [
		getMancalaPosition(0),
		getMancalaPosition(1)
	]

	if (mancalaPosition.some(p => p.line === line && p.column === column)) {
		return true;
	}

	board[line][column] = 0

	let i = line;
	let j = column;
	let dir = line === 0 ? -1 : 1;

	while (count > 0) {
		j += dir;

		if (j > board[i].length - 1 || i === 0 && j === -1) {
			i = (i + 1) % 2
			dir *= -1
			j = i === 0 ? board[i].length - 1 : 0
		}

		const nextPlayerMancala = mancalaPosition[getNextPlayer(player)];

		if (nextPlayerMancala.line === i && nextPlayerMancala.column === j) {
			continue;
		}

		board[i][j] += 1
		count--;
	}

	if (board[i][j] === 1 && i === line) {

		const ahead = getPositionAhead(i, j);

		if (board[board[ahead.line][ahead.column]]) {
			const sum = 1 + board[ahead.line][ahead.column];
			board[i][j] = 0;
			board[ahead.line][ahead.column] = 0;

			const mancala = mancalaPosition[player]
			board[mancala.line][mancala.column] += sum
		}
	}

	return mancalaPosition[player].line === i
		&& mancalaPosition[player].column === j
}

function endGame(board) {
	const lines = [
		board[0].slice(1, 7),
		board[1]
	].map(l => l.reduce((acc, v) => v + acc, 0))

	const playerWithoutPieces = lines.findIndex(l => l === 0)
	if (playerWithoutPieces > -1) {
		const otherPlayer = getNextPlayer(playerWithoutPieces);
		const mancala = getMancalaPosition(otherPlayer);
		board[mancala.line][mancala.column] += lines[otherPlayer]

		for (let j = (otherPlayer === 0 ? 1 : 0); j < (otherPlayer === 0 ? 7 : 6); j++) {
			board[otherPlayer][j] = 0;
		}

		return true;
	}
	return false;

}

function findWinner(board) {
	const playerOneMancala = getMancalaPosition(0);
	const playerTwoMancala = getMancalaPosition(1);

	const playerOneScore = board[playerOneMancala.line][playerOneMancala.column]
	const playerTwoScore = board[playerTwoMancala.line][playerTwoMancala.column]

	if (playerOneScore === playerTwoScore) {
		return ""
	} else if (playerOneScore > playerTwoScore) {
		return "0";
	} else if (playerOneScore < playerTwoScore) {
		return "1";
	}
}

export const slice = createSlice({
	name: 'mancala',
	initialState: {
		board: [
			[0, 3, 3, 3, 3, 3, 3, 0],
			[3, 3, 3, 3, 3, 3],
		],
		currentPlayer: 1,
		winner: "",
		gameEnded: false,
	},
	reducers: {
		selectPosition: (state, action) => {
			
			console.log(action.payload)
			const { i, j } = action.payload;

			if (i === state.currentPlayer) {
				const board = state.board.slice(0).map(l => l.slice(0))


				const shouldPlayAgain = distributePieces(board, i, j)
				const gameEnded = endGame(board)
				let winner = ""
				if (gameEnded) {
					winner = findWinner(board);
				}
				return {
					...state,
					board,
					currentPlayer: shouldPlayAgain ? state.currentPlayer : (state.currentPlayer + 1) % 2,
					winner,
					gameEnded
				}
			}

		},

		restartGame: (state) => {
			return {
				...state,
				board: [
					[0, 3, 3, 3, 3, 3, 3, 0],
					[3, 3, 3, 3, 3, 3],
				],
				currentPlayer: 1,
			}
		}
	}
})

export const {
	selectPosition,
	restartGame
} = slice.actions

export default slice.reducer