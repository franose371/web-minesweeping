"use strict";

(function () {
	function Mineblock(cloumns, rows) {
		this.cloumns = cloumns;
		this.rows = rows;
		this.isClicked = false; //boolean, default false
		this.isMined = false; //boolean default false
		this.roundMines = 0; //0-8
		this.isClicked = false;
	}
	window.Mineblock = Mineblock;
})();

(function () {
	var Mineblock = window.Mineblock;
	var MineSweeping = {
		mine_num: 99,
		block_width: 20,
		block_height: 20,
		mines: [],
		cleanArr: [],
		count: 0,
		cleanArea: function cleanArea(columns, rows, mineObject) {
			for (var k = -1; k < 2; k++) {
				for (var l = -1; l < 2; l++) {
					if (columns + l > -1 && rows + k > -1 && columns + l < 30 && rows + k < 16 && mineObject.mines[columns + l][rows + k].isClicked === false) {
						mineObject.cleanArr.push({
							columns: columns + l,
							rows: rows + k
						});
						mineObject.mines[columns + l][rows + k].isClicked = true;
						mineObject.count++;
						if (mineObject.mines[columns + l][rows + k].roundMines === 0) {
							mineObject.cleanArea(columns + l, rows + k, mineObject);
						}
					}
				}
			}
		},
		getMineIndex: function getMineIndex(x, y, mineObject) {
			var xIndex = Math.floor(x / mineObject.block_width);
			var yIndex = Math.floor(y / mineObject.block_height);
			return {
				xIndex: xIndex,
				yIndex: yIndex
			};
		},
		getEventPosition: function getEventPosition(ev) {
			var x, y;
			if (ev.layerX || ev.layerX == 0) {
				x = ev.layerX;
				y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX == 0) {
				// Opera  
				x = ev.offsetX;
				y = ev.offsetY;
			}
			return {
				x: x,
				y: y
			};
		},
		//创建地雷层，设置99个雷
		createMines: function createMines() {
			//创造地雷层的canvas
			var mineCanvas = document.createElement("canvas");
			mineCanvas.id = "mineCanvas";
			mineCanvas.width = '600';
			mineCanvas.height = '320';
			mineCanvas.style.border = '1px solid #aaa';
			mineCanvas.style.position = 'absolute';
			mineCanvas.style.top = 0;
			mineCanvas.style.left = 0;

			document.body.appendChild(mineCanvas);

			if (mineCanvas.getContext("2d")) {
				var mineContext = mineCanvas.getContext("2d");
			} else {
				alert("浏览器不兼容");
			}

			//背景填充
			mineContext.fillStyle = "gray";
			mineContext.fillRect(0, 0, 600, 320);

			var xIndex = [];
			var yIndex = [];
			var positions = [];
			//创建二维数组mines
			var mines = this.mines;
			mines = new Array(30);
			for (var i = 0, length1 = mines.length; i < length1; i++) {
				mines[i] = new Array(16);
			}

			for (var _i = 0, _length = mines.length; _i < _length; _i++) {
				for (var j = 0, _length2 = mines[_i].length; j < _length2; j++) {
					mines[_i][j] = new Mineblock(_i, j);
				}
			}
			//生成所有可能的坐标索引
			for (var _i2 = 0; _i2 < 30; _i2++) {
				for (var _j = 0; _j < 16; _j++) {
					positions.push({
						x: _i2,
						y: _j
					});
				}
			}

			//在所有可能的坐标中选出99个不重复的坐标

			for (var _i3 = 0; _i3 < 99; _i3++) {
				var _index = Math.floor(Math.random() * positions.length);
				var position = positions[_index];
				var x = position.x;
				var y = position.y;
				//mines[x][y] = new Mineblock(x, y);
				mines[x][y].isMined = true;
				positions.splice(_index, 1);
			}
			//遍历生成每个格子里的数字
			var mineNum;
			for (var _i4 = 0, _length3 = mines.length; _i4 < _length3; _i4++) {
				for (var _j2 = 0, _length4 = mines[_i4].length; _j2 < _length4; _j2++) {
					mineNum = 0;
					for (var k = -1; k < 2; k++) {
						for (var l = -1; l < 2; l++) {
							if (_i4 + l > -1 && _j2 + k > -1 && _i4 + l < 30 && _j2 + k < 16) {
								if (mines[_i4 + l][_j2 + k].isMined === true) {
									mineNum++;
								}
							}
						}
					}
					mines[_i4][_j2].roundMines = mineNum;
				}
			}

			for (var _i5 = 0; _i5 < mines.length; _i5++) {
				for (var _j3 = 0; _j3 < mines[_i5].length; _j3++) {
					if (mines[_i5][_j3].isMined === true) {
						mineContext.fillStyle = "red";
						mineContext.fillRect(mines[_i5][_j3].cloumns * 20, mines[_i5][_j3].rows * 20, this.block_width, this.block_height); //绘制矩形
					} else {
						mineContext.fillStyle = "white";
						mineContext.font = "15px Arial";
						mineContext.textAlign = 'center';
						if (mines[_i5][_j3].roundMines !== 0) {
							mineContext.fillText(mines[_i5][_j3].roundMines, mines[_i5][_j3].cloumns * 20 + 10, mines[_i5][_j3].rows * 20 + 15);
						}
					}
				}
			}
			this.mines = mines;
		},

		createMask: function createMask() {
			var BLOCK_WIDTH = this.block_width;
			var BLOCK_HEIGHT = this.block_height;
			//创造遮罩层的canvas
			var maskCanvas = document.createElement("canvas");
			maskCanvas.id = "maskCanvas";
			maskCanvas.width = '600';
			maskCanvas.height = '320';
			maskCanvas.style.border = '1px solid #aaa';
			maskCanvas.style.position = 'absolute';
			maskCanvas.style.top = 0;
			maskCanvas.style.left = 0;

			document.body.appendChild(maskCanvas);

			if (mineCanvas.getContext("2d")) {
				var maskContext = maskCanvas.getContext("2d");
			} else {
				alert("浏览器不兼容");
			}

			maskContext.fillStyle = "black";
			maskContext.strokeStyle = 'gray';
			maskContext.lineWidth = 1; //边框宽度
			for (var x = 0; x < 600; x = x + BLOCK_WIDTH) {
				for (var y = 0; y < 320; y = y + BLOCK_HEIGHT) {
					maskContext.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
					maskContext.strokeRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
				}
			}

			var getPosition = this.getEventPosition;
			var getMineIndex = this.getMineIndex;
			var cleanArr = this.cleanArr;
			var selfMine = this;
			var mines = this.mines;
			maskCanvas.addEventListener("click", function (e) {
				var p = getPosition(e);
				var index = getMineIndex(p.x, p.y, selfMine);
				maskContext.clearRect(index.xIndex * BLOCK_WIDTH, index.yIndex * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
				if (mines[index.xIndex][index.yIndex].isClicked === false) {
					mines[index.xIndex][index.yIndex].isClicked = true;
					selfMine.count++;
				}

				if (selfMine.count === 480 - 99) {
					maskContext.clearRect(0, 0, 600, 320);
					alert("you win");
				}
				if (mines[index.xIndex][index.yIndex].isMined === true) {
					maskContext.clearRect(0, 0, 600, 320);
					alert("you lose");
					if (confirm("do you want to play again?")) {
						selfMine.init();
					} else {
						alert("goodbye");
					}
				} else if (mines[index.xIndex][index.yIndex].roundMines === 0 && mines[index.xIndex][index.yIndex].isMined === false) {
					selfMine.cleanArea(index.xIndex, index.yIndex, selfMine);
					for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
						maskContext.clearRect(cleanArr[i].columns * BLOCK_WIDTH, cleanArr[i].rows * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
					}
				}
			}, false);
		},

		init: function init() {
			if (document.getElementById("maskCanvas")) {
				document.getElementById("maskCanvas").remove();
			}
			if (document.getElementById("mineCanvas")) {
				document.getElementById("mineCanvas").remove();
			}
			this.mines = [];
			this.cleanArr = [];
			this.count = 0;
			this.createMines();
			this.createMask();
		}

	};
	window.MineSweeping = MineSweeping;
})();
