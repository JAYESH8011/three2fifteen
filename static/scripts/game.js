loader.addModule('Game',
'request', 'config', 'auth', 'utils',
(request, config, auth, utils) => {
	let _currentPlay = {};
	const BOARD_WIDTH = 15;

	const _play = (gameId, dryRun) => {
		const endpoint = dryRun && config.api_turn_check || config.api_turn;
		return new Promise((resolve, reject) => {
			request.put(
				utils.format(config.api_host + endpoint, [gameId]),
				JSON.stringify({'play': Object.values(_currentPlay)}),
				auth.getHeader(),
				(statusCode, body) => {
					if (statusCode != 200) {
						reject(body.message);
					}

					if (!dryRun) {
						_currentPlay = {};
					}
					resolve(body.score);
				}
			);
		});
	};

	return {
		analyseGame: (game) => {
			game.ongoing = game.date_started && !game.date_finished;
			game.open = !game.date_finished && game.count_players < game.number_players;
		},
		findWinner: (game) => {
			let maxPoints = 0, winner = null;
			for (let player of game.players) {
				if (player.points > maxPoints) {
					maxPoints = player.points;
					winner = player;
				}
			}

			if (winner != null) {
				game.winner = winner;
				game.current_is_winner = winner.is_current;
			}
		},
		setBoardContent: (board, content) => {
			for (let token of content) {
				const index = token.y * BOARD_WIDTH + token.x;
				board[index].token = token;
			}
		},
		placeToken: (gameId, tokenId, x, y, value) => {
			_currentPlay[tokenId] = {'value': value, 'x': x, 'y': y};
			return _play(gameId, true);
		},
		removeToken: (gameId, tokenId) => {
			delete _currentPlay[tokenId];
			return Object.keys(_currentPlay).length && _play(gameId, true);
		},
		play: (gameId) => {
			return _play(gameId, false);
		}
	};
});
