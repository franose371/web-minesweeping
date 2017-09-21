/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isOutRange = undefined;

var _bomb = __webpack_require__(1);

var _bomb2 = _interopRequireDefault(_bomb);

var _bomb3 = __webpack_require__(2);

var _bomb4 = _interopRequireDefault(_bomb3);

var _flag = __webpack_require__(3);

var _flag2 = _interopRequireDefault(_flag);

var _config = __webpack_require__(4);

var _config2 = _interopRequireDefault(_config);

var _data = __webpack_require__(5);

__webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MineSweeping = {},
    mine_num,
    block_width = 20,
    block_height = 20,
    panel_columns,
    panel_rows,
    mines = [],
    cleanArr = [],
    count = 0,
    timeCount,
    firstClick = [],
    flagContext,
    maskContext,
    maskCanvas,
    mineCanvas,
    mineContext,
    oTimer,
    myTime,
    isMouseDown = false,
    isDoubleMouseDown = false,
    isGameLose = false,
    wrongedMineIndex = [],
    imgObjects = [];

//图片预加载
MineSweeping.loadImage = function (imgList) {
	var count = 0;
	for (var i = 0, length1 = imgList.length; i < length1; i++) {
		window['img' + i] = new Image();
		window['img' + i].src = imgList[i];
		window['img' + i].onload = function (i) {
			count++;
			imgObjects.push(window['img' + i]);
			window['img' + i].onload = null;
		}(i);
	}
	return count === imgList.length ? true : false;
};

MineSweeping.setTimer = function (isFinished) {
	var timeText;

	function settime() {
		timeCount = timeCount + 1;
		if (timeCount < 10) {
			timeText = "00" + timeCount;
		} else if (timeCount >= 10 && timeCount < 100) {
			timeText = "0" + timeCount;
		} else {
			timeText = timeCount;
		}
		oTimer.innerHTML = timeText;
	}

	!isFinished ? myTime = setInterval(settime, 1000) : clearInterval(myTime);
};
MineSweeping.setMineNum = function (level) {
	if (level) {
		var curLevel = _config2.default[level];
		mine_num = curLevel["mine_num"];
		panel_rows = curLevel["panel_rows"];
		panel_columns = curLevel["panel_columns"];
	}
};

//清除遮罩层
MineSweeping.cleanMask = function (columns, rows) {
	maskContext.clearRect(0, 0, panel_columns * block_width, panel_rows * block_height);
	mineContext.drawImage(imgObjects[1], columns * block_width + 1, rows * block_height + 1, block_width - 2, block_height - 2);
	maskCanvas.remove();
	MineSweeping.setTimer(true);
};
//清除当前点击块周围的块
MineSweeping.cleanArea = function (columns, rows, mineObject) {
	for (var k = -1; k < 2; k++) {
		for (var l = -1; l < 2; l++) {
			if (!this.isOutRange(columns + l, rows + k)) {
				var cur = mines[columns + l][rows + k];
				if (!cur.isClicked) {
					if (cur.isFlaged === false) {
						cleanArr.push({
							columns: columns + l,
							rows: rows + k
						});
						cur.isClicked = true;
						count++;
					}
					if (cur.isClicked && cur.isMined && !cur.isFlaged) {
						var cur = mines[columns + l][rows + k];
						isGameLose = true;
						wrongedMineIndex.push({
							xIndex: columns + l,
							yIndex: rows + k
						});
					}
					if (cur.roundMines === 0) {
						var cur = mines[columns + l][rows + k];
						mineObject.cleanArea(columns + l, rows + k, mineObject);
					}
				}
			}
		}
	}
};

//得到当前索引
MineSweeping.getMineIndex = function (x, y, mineObject) {
	if (x > 0 && y > 0 && x < panel_columns * block_width - 1 && y < panel_rows < panel_rows * block_height - 1) {
		var xIndex = Math.floor(x / block_width);
		var yIndex = Math.floor(y / block_height);
		return {
			xIndex: xIndex,
			yIndex: yIndex
		};
	} else {
		return false;
	}
};

MineSweeping.getEventPosition = function (ev, parentEle) {
	var x, y;
	x = ev.clientX - parseInt(maskCanvas.offsetLeft);
	y = ev.clientY - parseInt(maskCanvas.offsetTop);
	return {
		x: x,
		y: y
	};
};

MineSweeping.handleClick = function (e, self) {
	var p = self.getEventPosition(e, maskCanvas);
	var i = self.getMineIndex(p.x, p.y, self);
	if (e.type === "mouseup") {
		isDoubleMouseDown ? MineSweeping.handleDoubleClick(e, self) : MineSweeping.handleSingleClick(e, self);
	}
};

//左右键同时按下
MineSweeping.handleDoubleClick = function (event, self) {
	var p = self.getEventPosition(event, maskCanvas);
	var i = self.getMineIndex(p.x, p.y, self);
	var flagNum = 0;
	var columns = i.xIndex;
	var rows = i.yIndex;
	var cur = mines[i.xIndex][i.yIndex];
	if (cur.isClicked) {
		for (var k = -1; k < 2; k++) {
			for (var l = -1; l < 2; l++) {
				if (!this.isOutRange(columns + l, rows + k)) {
					if (mines[columns + l][rows + k].isFlaged) {
						flagNum++;
					}
				}
			}
		}
		if (flagNum === cur.roundMines) {
			MineSweeping.cleanArea(i.xIndex, i.yIndex, self);
			for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
				MineSweeping.clearBlock(cleanArr[i].columns, cleanArr[i].rows, -1, -1);
			}
		}
		if (isGameLose === true) {
			MineSweeping.cleanMask(wrongedMineIndex[0].xIndex, wrongedMineIndex[0].yIndex);
		}
		if (count === panel_columns * panel_rows - mine_num) {
			MineSweeping.cleanMask();
			self.setTimer(true);
			alert("you win! time:" + parseInt(oTimer.innerHTML) + "s");
		}
	}
	isMouseDown = false;
	isDoubleMouseDown = false;
};
MineSweeping.clearBlock = function (column, row, xOffSet, yOffSet) {
	maskContext.clearRect(column * block_width, row * block_height, block_width + xOffSet, block_height + yOffSet);
};
//只有一个键被按下
MineSweeping.handleSingleClick = function (event, self) {
	var p = self.getEventPosition(event, maskCanvas);
	var i = self.getMineIndex(p.x, p.y, self);
	//左键点击事件
	if (maskCanvas && i) {
		if (event.button === 0) {
			if (count === 0) {
				//第一次点击时，生成雷
				firstClick.push(i.xIndex);
				firstClick.push(i.yIndex);
				self.createMines(firstClick);
				self.setTimer(false);
			}
			var cur = mines[i.xIndex][i.yIndex];
			if (!cur.isFlaged) {
				MineSweeping.clearBlock(i.xIndex, i.yIndex, -1, -1);
				//当前块被点击时，isClicked改为true
				if (!cur.isClicked && !cur.isMined) {
					cur.isClicked = true;
					count++;
				}
				//胜利的条件
				if (count === panel_columns * panel_rows - mine_num) {
					maskContext.clearRect(0, 0, panel_columns * block_width, panel_rows * block_height);
					maskCanvas.remove();
					self.setTimer(true);
					alert("you win! time:" + parseInt(oTimer.innerHTML) + "s");
				}
				//点击到雷时
				if (cur.isMined && !cur.isClicked) {
					MineSweeping.cleanMask(i.xIndex, i.yIndex);
				} else if (cur.roundMines === 0 && !cur.isMined) {
					self.cleanArea(i.xIndex, i.yIndex, self);
					for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
						MineSweeping.clearBlock(cleanArr[i].columns, cleanArr[i].rows, -1, -1);
					}
					if (count === panel_columns * panel_rows - mine_num) {
						maskContext.clearRect(0, 0, panel_columns * block_width, panel_rows * block_height);
						maskCanvas.remove();
						alert("you win! time: " + parseInt(oTimer.innerHTML) + "s");
					}
				}
			}
		}
		//右键点击事件 
		else if (event.button === 2) {
				var cur = mines[i.xIndex][i.yIndex];
				if (i && count !== 0) {
					if (!cur.isClicked) {
						if (!cur.isFlaged) {
							cur.isFlaged = true;
							maskContext.drawImage(imgObjects[2], i.xIndex * block_width + 1, i.yIndex * block_height + 1, block_width - 2, block_height - 2);
						} else if (cur.isFlaged) {
							cur.isFlaged = false;
							MineSweeping.drawBlock(maskContext, "#c2c2c2", "white", i.xIndex * block_width, i.yIndex * block_height, block_width, block_height);
						}
						return false;
					}
				}
			}
	}
};

MineSweeping.drawText = function (color, column, row) {
	mineContext.fillStyle = color;
	mineContext.fillText(mines[column][row].roundMines, mines[column][row].columns * block_width + 10, mines[column][row].rows * block_height + 15);
};

MineSweeping.isOutRange = function (column, row) {
	return column > -1 && row > -1 && column < panel_columns && row < panel_rows ? false : true;
};

MineSweeping.drawBlock = function (context, fillColor, strokeColor, xPos, yPos, width, height) {
	context.fillStyle = fillColor;
	context.strokeStyle = strokeColor;
	context.fillRect(xPos, yPos, width, height);
	context.strokeRect(xPos, yPos, width, height);
};

MineSweeping.createMines = function (firstClick) {
	//创造地雷层的canvas
	mineCanvas = document.createElement("canvas");
	mineCanvas.id = "mineCanvas";
	mineCanvas.width = panel_columns * block_width;
	mineCanvas.height = panel_rows * block_height;
	document.body.appendChild(mineCanvas);

	mineCanvas.getContext("2d") ? mineContext = mineCanvas.getContext("2d") : alert("浏览器不兼容");

	//背景填充
	for (var x = 0; x < panel_columns * block_width; x = x + block_width) {
		for (var y = 0; y < panel_rows * block_height; y = y + block_height) {
			MineSweeping.drawBlock(mineContext, '#D3D3D3', 'white', x, y, block_width, block_height);
		}
	}

	mines = (0, _data.createData)(firstClick, panel_columns, panel_rows, mine_num);

	for (var i = 0, length1 = mines.length; i < length1; i++) {
		for (var j = 0, length2 = mines[i].length; j < length2; j++) {
			if (mines[i][j].isMined === true) {
				mineContext.drawImage(imgObjects[0], mines[i][j].columns * block_width, mines[i][j].rows * block_height);
			}
			if (mines[i][j].roundMines !== 0 && !mines[i][j].isMined) {
				//绘制不同颜色的数字
				mineContext.font = "15px Arial";
				mineContext.textAlign = 'center';
				var color = ["blue", "green", "red", "#4B0082", "#A0522D", "#00CED1", "black", "gray"];
				var textColor = color[mines[i][j].roundMines - 1];
				MineSweeping.drawText(textColor, i, j);
			}
		}
	}
};
MineSweeping.createMask = function () {
	maskCanvas = document.createElement("canvas");
	maskCanvas.id = "maskCanvas";
	maskCanvas.width = panel_columns * block_width;
	maskCanvas.height = panel_rows * block_height;

	document.body.appendChild(maskCanvas);

	maskCanvas.getContext("2d") ? maskContext = maskCanvas.getContext("2d") : alert("浏览器不兼容");

	for (var x = 0; x < panel_columns * block_width; x = x + block_width) {
		for (var y = 0; y < panel_rows * block_height; y = y + block_height) {
			MineSweeping.drawBlock(maskContext, '#c2c2c2', 'white', x, y, block_width, block_height);
		}
	}

	var selfMine = this;

	maskCanvas.addEventListener("mouseup", function (e) {
		isMouseDown = false;
		selfMine.handleClick(e, selfMine);
	}, false);
	maskCanvas.addEventListener("mousedown", function (e) {
		if (isMouseDown) {
			isDoubleMouseDown = true;
		} else {
			isMouseDown = true;
		}
	}, false);
};

//生成计时器和开始按钮节点
MineSweeping.createInfo = function () {
	var mask = document.getElementById("maskCanvas");
	var oInfo = document.createElement("div");
	oInfo.id = "minesweeping-info-block";
	oInfo.style.top = parseInt(mask.offsetTop) + panel_rows * block_height / 2 + 'px';

	oTimer = document.createElement("div");
	oTimer.id = "minesweeping-info-timer";
	oTimer.innerHTML = "000";

	var oButton = document.createElement("button");
	oButton.id = "minesweeping-info-button";
	oButton.innerHTML = "start";

	oInfo.appendChild(oTimer);
	oInfo.appendChild(oButton);
	document.body.insertBefore(oInfo, mask);

	oButton.addEventListener("click", function () {
		MineSweeping.init();
		MineSweeping.setTimer(true);
	}, false);
};

MineSweeping.init = function (level) {
	if (document.getElementById("maskCanvas")) {
		document.getElementById("maskCanvas").remove();
	}
	if (document.getElementById("mineCanvas")) {
		document.getElementById("mineCanvas").remove();
	}
	if (document.getElementById("minesweeping-info-block")) {
		document.getElementById("minesweeping-info-block").remove();
	}
	mines = [];
	cleanArr = [];
	count = 0;
	timeCount = 0;
	firstClick = [];
	isGameLose = false;
	wrongedMineIndex = [];
	MineSweeping.setTimer(true);
	//预加载图片
	MineSweeping.loadImage([_bomb2.default, _bomb4.default, _flag2.default]);
	//禁止右键事件
	document.oncontextmenu = function (e) {
		return false;
	};
	this.setMineNum(level);
	this.createMask();
	this.createInfo();
};

MineSweeping.setLevel = function () {
	//默认显示初级扫雷
	MineSweeping.init("beginner");
	var oInfo = document.createElement("span");
	oInfo.innerHTML = "请选择难度：";
	var oSel = document.createElement("select");
	//根据屏幕宽度显示可选择的级别
	if (screen.width < 430) {
		oSel.innerHTML = '<option value="beginner">\u521D\u7EA7</option>';
	} else if (screen.width < 710) {
		oSel.innerHTML = '  <option value="beginner">\u521D\u7EA7</option>\n\t\t\t\t\t\t\t<option value ="intermediate">\u4E2D\u7EA7</option>\n\t\t\t\t\t\t\t\t';
	} else {
		oSel.innerHTML = '  <option value="beginner">\u521D\u7EA7</option>\n\t\t\t\t\t\t\t<option value ="intermediate">\u4E2D\u7EA7</option>\n\t\t\t\t\t\t\t<option value ="expert">\u9AD8\u7EA7</option>\n\t\t\t\t\t\t\t';
	}
	document.body.appendChild(oInfo);
	document.body.appendChild(oSel);
	oSel.addEventListener("change", function (e) {
		e = e || window.event;
		var target = e.target || e.srcElement;
		MineSweeping.init(target.value);
	}, false);
};

MineSweeping.setLevel();

//window.MineSweeping = MineSweeping;

var isOutRange = MineSweeping.isOutRange;

exports.isOutRange = isOutRange;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "6cf555103b43e359d28f81bd9d75bd6a.jpg";

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "e23092508b37e192b27c6b16e8582c0e.jpg";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "d4a5bf6afdfd8f254e85ba2db6b86bf1.jpg";

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {"expert":{"mine_num":99,"panel_columns":30,"panel_rows":16},"intermediate":{"mine_num":40,"panel_columns":16,"panel_rows":16},"beginner":{"mine_num":10,"panel_columns":8,"panel_rows":8}}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createData = undefined;

var _Mineblock = __webpack_require__(6);

var _index = __webpack_require__(0);

function createData(firstClick, panel_columns, panel_rows, mine_num) {
	var mines = [];
	var xIndex = [];
	var yIndex = [];
	var positions = [];
	//创建二维数组mines
	mines = new Array(panel_columns);
	for (var i = 0, length1 = mines.length; i < length1; i++) {
		mines[i] = new Array(panel_rows);
	}
	for (var _i = 0, length = mines.length; _i < length; _i++) {
		for (var _j = 0, length2 = mines[_i].length; _j < length2; _j++) {
			mines[_i][_j] = new _Mineblock.Mineblock(_i, _j);
		}
	}
	//生成所有可能的坐标索引
	for (var _i2 = 0; _i2 < panel_columns; _i2++) {
		for (var j = 0; j < panel_rows; j++) {
			positions.push({
				x: _i2,
				y: j
			});
		}
	}
	positions.splice(firstClick[0] * panel_rows + firstClick[1], 1);

	//在所有可能的坐标中选出不重复的坐标
	var positionLength = positions.length;
	for (var _i3 = 0; _i3 < mine_num; _i3++) {
		var index = Math.floor(Math.random() * positionLength);
		var position = positions[index];
		var x = position.x;
		var y = position.y;
		mines[x][y].isMined = true;
		positions[index] = positions[positionLength - 1];
		positionLength--;
	}
	//遍历得到每个格子里的数字
	var mineNum;
	for (var _i4 = 0, length3 = mines.length; _i4 < length3; _i4++) {
		for (var _j2 = 0, length4 = mines[_i4].length; _j2 < length4; _j2++) {
			mineNum = 0;
			for (var k = -1; k < 2; k++) {
				for (var l = -1; l < 2; l++) {
					if (!(0, _index.isOutRange)(_i4 + l, _j2 + k) && mines[_i4 + l][_j2 + k].isMined) {
						mineNum++;
					}
				}
			}
			mines[_i4][_j2].roundMines = mineNum;
		}
	}
	return mines;
}

exports.createData = createData;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mineblock = function Mineblock(columns, rows) {
	_classCallCheck(this, Mineblock);

	this.columns = columns;
	this.rows = rows;
	this.isClicked = false; //boolean, default false
	this.isMined = false; //boolean default false
	this.roundMines = 0; //0-8
	this.isClicked = false;
	this.isFlaged = false;
};

exports.Mineblock = Mineblock;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(10)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!./style.css", function() {
			var newContent = require("!!../node_modules/_css-loader@0.28.7@css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(undefined);
// imports


// module
exports.push([module.i, "#mineCanvas {\r\n\tmargin: auto;\r\n\tborder: 1px solid #aaa;\r\n\tposition: absolute;\r\n\tz-index: 98;\r\n\tleft: 100px;\r\n\ttop: 100px;\r\n}\r\n\r\n#maskCanvas {\r\n\tmargin: auto;\r\n\tborder: 1px solid #aaa;\r\n\tposition: absolute;\r\n\tz-index: 99;\r\n\tleft: 100px;\r\n\ttop: 100px;\r\n}\r\n\r\n#minesweeping-info-block {\r\n\tposition: absolute;\r\n}\r\n\r\n#minesweeping-info-timer {\r\n\twidth: 50px;\r\n\theight: 20px;\r\n\tbackground-color: black;\r\n\tcolor: red;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n}\r\n\r\n#minesweeping-info-button {\r\n\twidth: 50px;\r\n\theight: 20px;\r\n\tbackground-color: gray;\r\n\tcolor: white;\r\n\ttext-align: center;\r\n}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(11);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);