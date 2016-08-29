/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _enum = __webpack_require__(1);
	
	var _board = __webpack_require__(2);
	
	var _board2 = _interopRequireDefault(_board);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Gomoku = function () {
	  function Gomoku(playerName) {
	    _classCallCheck(this, Gomoku);
	
	    this.playerName = playerName;
	    this.board = new _board2.default();
	    this.whoStart = Math.round(Math.random());
	  }
	
	  _createClass(Gomoku, [{
	    key: 'setup',
	    value: function setup() {
	      // create board, pieces, set initial state to game, etc
	      this.board.forEach(function (value, i, j, board) {
	        board[i][j] = 'Blank Piece';
	      });
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      // main loop game
	      this.board.forEach(function (value, i, j, board) {
	        $('canvas').drawArc({
	          draggable: true,
	          fillStyle: "green",
	          x: 60 * i, y: 60 * j,
	          radius: 10
	        });
	      });
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      // reset game
	    }
	  }]);
	
	  return Gomoku;
	}();
	
	var gomoku = new Gomoku();
	gomoku.setup();
	gomoku.start();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Enum = exports.Enum = {
	  BOARD_ROWS_NUMBER: 15,
	  BOARD_COLUMNS_NUMBER: 15
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _enum = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board() {
	    _classCallCheck(this, Board);
	
	    this.board = new Array(_enum.Enum.BOARD_ROWS_NUMBER);
	    this.cleanBoard();
	  }
	
	  _createClass(Board, [{
	    key: 'cleanBoard',
	    value: function cleanBoard() {
	      for (var i = 0; i < _enum.Enum.BOARD_ROWS_NUMBER; i++) {
	        this.board[i] = new Array(_enum.Enum.BOARD_COLUMNS_NUMBER);
	      }
	    }
	  }, {
	    key: 'forEach',
	    value: function forEach(func) {
	      for (var i = 0; i < _enum.Enum.BOARD_ROWS_NUMBER; i++) {
	        for (var j = 0; j < _enum.Enum.BOARD_COLUMNS_NUMBER; j++) {
	          func(this.board[i][j], i, j, this.board);
	        }
	      }
	    }
	  }, {
	    key: 'set',
	    value: function set(func) {
	      func(this.board);
	    }
	  }, {
	    key: 'get',
	    value: function get(row, column, func) {
	      func(this.board, this.board[row][column]);
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map