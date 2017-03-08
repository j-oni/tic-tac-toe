/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var css = __webpack_require__(0);

var State = function State(old) {
	this.turn = '';
	this.oMovesCount = 0;
	this.result = 'still running';
	this.board = [];

	if (typeof old !== 'undefined') {
		var len = old.board.length;
		this.board = new Array(len);
		for (var itr = 0; itr < len; itr++) {
			this.board[itr] = old.board[itr];
		}

		this.oMovesCount = old.oMovesCount;
		this.result = old.result;
		this.turn = old.turn;
	}

	this.advanceTrun = function () {
		this.turn = this.turn === 'X' ? 'O' : 'X';
	};

	this.emptyCells = function () {
		var indxs = [];
		for (var _itr = 0; _itr < 9; _itr++) {
			if (this.board[_itr] === 'E') {
				indxs.push(_itr);
			}
		}
		return indxs;
	};

	this.isTerminal = function () {
		var B = this.board;

		for (var i = 0; i <= 6; i = i + 3) {
			if (B[i] !== 'E' && B[i] === B[i + 1] && B[i] === B[i + 2]) {
				this.result = B[i] + '-won';
				return true;
			}
		}

		for (var _i = 0; _i <= 2; _i++) {
			if (B[_i] !== 'E' && B[_i] === B[_i + 3] && B[_i] === B[_i + 6]) {
				this.result = B[_i] + '-won';
				return true;
			}
		}

		for (var _i2 = 0, j = 4; _i2 <= 2; _i2 = _i2 + 2, j = j - 2) {
			if (B[_i2] !== 'E' && B[_i2] === B[_i2 + j] && B[_i2] === B[_i2 + 2 * j]) {
				this.result = B[_i2] + '-won';
				return true;
			}
		}

		var available = this.emptyCelles();
		if (available.length === 0) {
			this.result = 'draw';
			return true;
		} else {
			return false;
		}
	};
};

var AI = function AI(level) {
	var levelOfIntelligence = level;
	var game = {};

	function minimaxValue(state) {
		if (state.isTerminal()) {
			return Game.score(state);
		} else {
			var stateScore;

			if (state.turn === 'X') {
				stateScore = -1000;
			} else {
				stateScore = 1000;
			}

			var availablePositions = state.emptyCells();

			var availableNextStates = availablePositions.map(function (pos) {
				var action = new AIAction(pos);
				var nextState = action.applyTo(state);
				return nextState;
			});

			availableNextStates.forEach(function (nextState) {
				var nextScore = minimaxValue(nextState);

				if (state.turn === 'X') {
					if (nextScore > stateScore) {
						stateScore = nextScore;
					}
				} else {
					if (nextScore < stateScore) {
						stateScore = nextScore;
					}
				}
			});

			return stateScore;
		}
	}

	function takeABlindMove(turn) {
		var available = game.currentState.emptyCells();
		var randomCell = available[Math.floor(Math.random() * available.length)];
		var action = new AIAction(randomCell);

		var next = action.applyTo(game.currentState);

		ui.insertAt(randomCell, turn);

		game.advanceTo(next);
	}

	function takeANoviceMove(turn) {
		var available = game.currentState.emptyCells();

		var availableActions = available.map(function (pos) {
			var action = new AIAction(pos);

			var nextState = action.applyTo(game.currentState);

			action.minimaxVal = minimaxValue(nextState);

			return action;
		});

		if (turn === 'X') {
			availableActions.sort(AIAction.DESCENDING);
		} else {
			availableActions.sort(AIAction.ASCENDING);
		}

		var chosenAction;
		if (Math.random() * 100 <= 40) {
			chosenAction = availableActions[0];
		} else {
			if (availableActions.length >= 2) {
				chosenAction = availableActions[1];
			} else {
				chosenAction = availableActions[0];
			}
		}

		var next = chosenAction.applyTo(game.currentState);

		ui.insertAt(chosenAction.movePosition, turn);

		game.advanceTo(next);
	}

	function takeAMasterMove(turn) {
		var available = game.currentState.emptyCells();

		var availableActions = available.map(function (pos) {
			var action = new AIAction(pos);

			var next = action.applyTo(game.currentState);

			action.minimaxVal = minimaxValue(next);

			return action;
		});

		if (turn === 'X') {
			availableActions.sort(AIAction.DESCENDING);
		} else {
			availableActions.sort(AIAction.ASCENDING);
		}

		var chosenAction = availableActions[0];
		var next = chosenAction.applyTo(game.currentState);

		ui.insertAt(chosenAction.movePosition, turn);

		game.advanceTo(next);
	}

	this.plays = function (_game) {
		game = _game;
	};

	this.notify = function (turn) {
		switch (levelOfIntelligence) {
			case 'blind':
				takeABlindMove(turn);break;
			case 'novice':
				takeANoviceMove(turn);break;
			case 'master':
				takeAMasterMove(turn);break;
		}
	};
};

var AIAction = function AIAction(pos) {
	this.movePosition = pos;
	this.minimaxVal = 0;

	this.applyTo = function (state) {
		var next = new State(state);

		next.board[this.movePosition] = state.turn;

		if (state.turn === 'O') {
			next.oMovesCount++;
		}

		next.advanceTurn();

		return next;
	};
};

AIAction.ASCENDING = function (firstAction, secondAction) {
	if (firstAction.minimaxVal < secondAction.minimaxVal) {
		return -1;
	} else if (firstAction.minimaxVal > secondAction.minimaxVal) {
		return 1;
	} else {
		return 0;
	}
};

AIAction.DESCENDING = function (firstAction, secondAction) {
	if (firstAction.minimaxVal > secondAction.minimaxVal) {
		return -1;
	} else if (firstAction.minimaxVal < secondAction.minimaxVal) {
		return 1;
	} else {
		return 0;
	}
};

var Game = function Game(autoPlayer) {
	this.ai = autoPlayer;
	this.currentState = new State();
	this.currentState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
	this.currentState.turn = 'X';
	this.status = 'beginning';

	this.advanceTo = function (_state) {
		this.currentState = _state;
		if (_state.isTerminal()) {
			this.status = 'ended';
			if (_state.result === 'X-won') {
				ui.switchViewTo('won');
			} else if (_state.result === 'O-won') {
				ui.switchViewTo('lost');
			} else {
				ui.switchViewTo('draw');
			}
		} else {
			if (this.currentState.turn === 'X') {
				ui.switchViewTo('human');
			} else {
				ui.switchViewTo('robot');
				this.ai.notify('O');
			}
		}
	};

	this.start = function () {
		if (this.status = 'beginning') {
			this.advanceTo(this.currentState);
			this.status = 'running';
		}
	};

	this.score = function (_state) {
		if (_state.result !== 'still running') {
			if (_state.result === 'X-won') {
				return 10 - _state.oMovesCount;
			} else if (_state.result === 'O-win') {
				return -10 + _state.oMovesCount;
			} else {
				return 0;
			}
		}
	};
};

/***/ })
/******/ ]);