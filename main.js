var MineSweeping = {
	mine_num: 99,
	block_width: 20,
	block_height: 20,
	mines: [],
	cleanArr: [],
	cleanArea: function(columns, rows) {
		for (let k = -1; k < 2; k++) {
			for (let l = -1; l < 2; l++) {
				if (columns + l > -1 && rows + k > -1 && columns + l < 30 && rows + k < 16) {
					if (l !== 0 && k !== 0) {
						MineSweeping.cleanArr.push({
							columns: columns + k,
							rows: rows + l
						});
						//maskContext.clearRect((index.xIndex + k) * BLOCK_WIDTH, (index.yIndex + l) * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
						if (mines[columns + l][rows + k].roundMines === 0) {
							MineSweeping.cleanArea(columns + l, rows + k);
						}
					}
				}
			}
		}
		return MineSweeping.cleanArr;
	},
	getMineIndex: function(x, y) {
		xIndex = Math.floor(x / MineSweeping.block_width);
		yIndex = Math.floor(y / MineSweeping.block_height);
		return {
			xIndex: xIndex,
			yIndex: yIndex
		}
	},
	getEventPosition: function(ev) {
		var x, y;
		if (ev.layerX || ev.layerX == 0) {
			x = ev.layerX;
			y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera  
			x = ev.offsetX;
			y = ev.offsetY;
		}
		return {
			x: x,
			y: y
		}
	},
	//创建地雷层，设置99个雷
	createMines: function() {
		//创造地雷层的canvas
		var mineCanvas = document.createElement("canvas");
		mineCanvas.id = "mineCanvas";
		mineCanvas.width = '600';
		mineCanvas.height = '320';
		mineCanvas.style.border = '1px solid #aaa';
		mineCanvas.style.position = 'absolute'
		mineCanvas.style.top = 0;
		mineCanvas.style.left = 0;

		document.body.appendChild(mineCanvas);

		if (mineCanvas.getContext("2d")) {
			var mineContext = mineCanvas.getContext("2d");
		} else {
			alert("浏览器不兼容");
		}

		//背景填充
		// mineContext.fillStyle = "gray";
		// mineContext.fillRect(0, 0, 600, 320);


		var xIndex = [];
		var yIndex = [];
		var positions = [];
		//创建二维数组mines
		mines = this.mines;
		mines = new Array(30);
		for (let i = 0, length1 = mines.length; i < length1; i++) {
			mines[i] = new Array(16);
		}

		for (let i = 0, length1 = mines.length; i < length1; i++) {
			for (let j = 0, length1 = mines[i].length; j < length1; j++) {
				mines[i][j] = new Mineblock(i, j);
			}
		}
		//生成所有可能的坐标索引
		for (let i = 0; i < 30; i++) {
			for (let j = 0; j < 16; j++) {
				positions.push({
					x: i,
					y: j
				});
			}
		}

		//在所有可能的坐标中选出99个不重复的坐标

		for (let i = 0; i < 99; i++) {
			let index = Math.floor(Math.random() * positions.length);
			let position = positions[index];
			let x = position.x;
			let y = position.y;
			//mines[x][y] = new Mineblock(x, y);
			mines[x][y].isMined = true;
			positions.splice(index, 1);
		}
		//遍历生成每个格子里的数字
		var mineNum;
		for (let i = 0, length1 = mines.length; i < length1; i++) {
			for (let j = 0, length1 = mines[i].length; j < length1; j++) {
				mineNum = 0;
				for (let k = -1; k < 2; k++) {
					for (let l = -1; l < 2; l++) {
						if (i + l > -1 && j + k > -1 && i + l < 30 && j + k < 16) {
								if (mines[i + l][j + k].isMined === true) {
									mineNum++;
							}
						}
					}
				}
				mines[i][j].roundMines = mineNum;
			}
		}



		for (let i = 0; i < mines.length; i++) {
			for (let j = 0; j < mines[i].length; j++) {
				if (mines[i][j].isMined === true) {
					mineContext.fillStyle = "red";
					mineContext.fillRect(mines[i][j].cloumns * 20, mines[i][j].rows * 20, this.block_width, this.block_height); //绘制矩形
				} else {
					mineContext.fillStyle = "blue";
					mineContext.font = "15px Arial";
					mineContext.textAlign = 'center';
					mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * 20 + 10, mines[i][j].rows * 20 + 15);
				}
			}
		}
		this.mines = mines;
	},

	createMask: function() {
		const BLOCK_WIDTH = this.block_width;
		const BLOCK_HEIGHT = this.block_height;
		//创造遮罩层的canvas
		var maskCanvas = document.createElement("canvas");
		maskCanvas.id = "maskCanvas";
		maskCanvas.width = '600';
		maskCanvas.height = '320';
		maskCanvas.style.border = '1px solid #aaa';
		maskCanvas.style.position = 'absolute'
		maskCanvas.style.top = 0;
		maskCanvas.style.left = 0;

		document.body.appendChild(maskCanvas);

		if (mineCanvas.getContext("2d")) {
			var maskContext = maskCanvas.getContext("2d");
		} else {
			alert("浏览器不兼容");
		}

		maskContext.fillStyle = "black";
		maskContext.strokeStyle = 'gray'
		maskContext.lineWidth = 1; //边框宽度
		for (let x = 0; x < 600; x = x + BLOCK_WIDTH) {
			for (let y = 0; y < 320; y = y + BLOCK_HEIGHT) {
				maskContext.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
				maskContext.strokeRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT)
			}
		}

		var getPosition = this.getEventPosition;
		var getMineIndex = this.getMineIndex;
		maskCanvas.addEventListener("click", function(e) {
			p = getPosition(e);
			index = getMineIndex(p.x, p.y);
			maskContext.clearRect(index.xIndex * BLOCK_WIDTH, index.yIndex * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
			if (mines[index.xIndex][index.yIndex].isMined === true) {
				alert("you lose");
				maskContext.clearRect(0, 0, 600, 320);
			}
			// } else if (mines[index.xIndex][index.yIndex].roundMines === 0) {
			// 	MineSweeping.cleanArr = [];
			// 	arrs = MineSweeping.cleanArea(index.xIndex, index.yIndex);
			// 	for (var i = 0, length1 = arrs.length; i < length1; i++) {
			// 		maskContext.clearRect(arrs[i].columns * BLOCK_WIDTH, arrs[i].rows * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1)
			// 	}
			// }
			// } else if (mines[index.yIndex][index.xIndex].roundMines === 0) {
			// 	for (let k = -1; k < 2; k++) {
			// 		for (let l = -1; l < 2; l++) {
			// 			if (index.yIndex + k > -1 && index.xIndex + l > -1 && index.yIndex + k < 16 && index.xIndex + l < 30) {
			// 				maskContext.clearRect((index.xIndex + k) * BLOCK_WIDTH, (index.yIndex + l) * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
			// 				if (mines[index.yIndex + k][index.xIndex + l].roundMines === 0) {
			// 					maskContext.clearRect((index.xIndex + k) * BLOCK_WIDTH, (index.yIndex + l) * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
			// 				}
			// 			}
			// 		}
			// 	}
			// }

		}, false);
	},


	init: function() {
		this.createMines();
		this.createMask();
	}



};