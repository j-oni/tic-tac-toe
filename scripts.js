const css = require('./style.scss');

var State = function(old) {
	this.turn = '';
	this.oMovesCount = 0;
	this.result = 'still running';
	this.board = [];

	if(typeof old !== 'undefined') {
		var len = old.board.length;
		this.board = new Array(len);
		for(let itr = 0; itr < len; itr++) {
			this.board[itr] = old.board[itr];
		}

		this.oMovesCount = old.oMovesCount;
		this.result = old.result;
		this.turn = old.turn;
	}

	this.advanceTrun = function() {
		this.turn = this.turn === 'X' ? 'O' : 'X';
	}

	this.emptyCells = function() {
		var indxs = [];
		for(let itr = 0; itr < 9; itr++) {
			if(this.board[itr] === 'E') {
				indxs.push(itr);
			}
		}
		return indxs; 
	}

	this.isTerminal = function() {
		var B = this.board;

		for(let i = 0; i <= 6; i = i + 3) {
			if(B[i] !== 'E' && B[i] === B[i+1] && B[i] === B[i+2]) {
				this.result = B[i] + '-won';
				return true;
			}
		}

		for(let i = 0; i <= 2; i++) {
			if(B[i] !== 'E' && B[i] === B[i+3] && B[i] === B[i+6]) {
				this.result = B[i] + '-won';
				return true;
			}
		}

		for(let i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
			if(B[i] !== 'E' && B[i] === B[i+j] && B[i] === B[i+2*j]) {
				this.result = B[i] + '-won';
				return true;
			}
		}

		var available = this.emptyCelles();
		if(available.length === 0) {
			this.result = 'draw';
			return true;
		} else {
			return false;
		}
	}
}

var AI = function(level) {
	var levelOfIntelligence = level;
	var game = {};

	function minimaxValue(state) {
		
	}

	function takeABlindMove(turn) {
		
	}

	function takeANoviceMove(turn) {
		
	}

	function takeAMasterMove(turn) {

	}

	this.plays = function(_game) {
		game = _game;
	};

	this.notify = function(turn) {
		switch(levelOfIntelligence) {
			case 'blind': takeABlindMove(turn); break;
			case 'novice': takeANoviceMove(turn); break;
			case 'master': takeAMasterMove(turn); break;
		}
	};
}

var AIAction = function(pos) {
	this.movePosition = pos;
	this.minimaxVal = 0;

	this.applyTo = function(state) {
		var next = new State(state);

		next.board[this.movePosition] = state.turn;

		if(state.turn === 'O') {
			next.oMovesCount++;
		}

		next.advanceTurn();

		return next;
	}
}

AIAction.ASCENDING = function(firstAction, secondAction) {
	if(firstAction.minimaxVal < secondAction.minimaxVal) {
		return -1;
	} else if (firstAction.minimaxVal > secondAction.minimaxVal) {
		return 1;
	} else {
		return 0;
	}
};

AIAction.DESCENDING = function(firstAction, secondAction) {
	if(firstAction.minimaxVal > secondAction.minimaxVal) {
		return -1;
	} else if (firstAction.minimaxVal < secondAction.minimaxVal) {
		return 1;
	} else {
		return 0;
	}
};

var Game = function(autoPlayer) {
	this.ai = autoPlayer;
	this.currentState = new State();
	this.currentState.board = ['E', 'E', 'E',
							   'E', 'E', 'E',
						   	   'E', 'E', 'E'];
	this.currentState.turn = 'X';
	this.status = 'beginning';

	this.advanceTo = function(_state) {
		this.currentState = _state;
		if(_state.isTerminal()) {
			this.status = 'ended';
			if(_state.result === 'X-won') {
				ui.switchViewTo('won');
			} else if (_state.result === 'O-won') {
				ui.switchViewTo('lost');
			} else {
				ui.switchViewTo('draw');
			}
		} else {
			if(this.currentState.turn === 'X') {
				ui.switchViewTo('human');
			} else {
				ui.switchViewTo('robot');	
				this.ai.notify('O');			
			}
		}
	};

	this.start = function() {
		if(this.status = 'beginning') {
			this.advanceTo(this.currentState);
			this.status = 'running';
		}
	};
};