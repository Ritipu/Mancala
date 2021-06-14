import React from 'react';
import { useDispatch, useSelector } from "react-redux"
import { selectPosition, restartGame, checkIfCurrentPlayer } from './mancalaSlice'
import styles from './Mancala.module.css'

function Mancala() {

	const { board, gameEnded, winner, currentPlayer } = useSelector(state => state.mancala)

	const dispatch = useDispatch();

	return (
		<div className={styles.mancala}>
			<h1>Mancala</h1>

			<table>
				<tbody>
					{
						board.map((linha, i) => (
							<tr>
								{
									linha.map((casa, j) => (
										<td
											className={checkIfCurrentPlayer(i, j, currentPlayer) ? styles.current : ""}
											onClick={() => dispatch(selectPosition({ i, j }))}
											rowSpan={
												(i === 0 && j === 0)
													|| (i === 0 && j === 7) ? 2 : 1
											}
											key={j}>
											{casa}
										</td>
									))
								}
							</tr>
						))
					}
				</tbody>
			</table>
			<p>Jogo Terminou: {gameEnded ? "Sim" : "Não"}</p>
			<p>Vencedor: {winner}</p>
			<button onClick={() => dispatch(restartGame())}>
				Recomeçar
            </button>
		</div>
	)
}

export default Mancala