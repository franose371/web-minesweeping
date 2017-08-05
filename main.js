var MineSweeping = {
	mine_num: 99,
	block_width: 20,
	block_height: 20,
	mines: [],
	cleanArr: [],
	count: 0,
	cleanArea: function(columns, rows, mineObject) {
		for (let k = -1; k < 2; k++) {
			for (let l = -1; l < 2; l++) {
				if (columns + l > -1 && rows + k > -1 && columns + l < 30 && rows + k < 16 && mines[columns + l][rows + k].isClicked === false) {
					mineObject.cleanArr.push({
						columns: columns + l,
						rows: rows + k
					});
					mines[columns + l][rows + k].isClicked = true;
					mineObject.count++;
					if (mines[columns + l][rows + k].roundMines === 0) {
						mineObject.cleanArea(columns + l, rows + k, mineObject);
					}
				}
			}
		}
	},
	getMineIndex: function(x, y, mineObject) {
		xIndex = Math.floor(x / mineObject.block_width);
		yIndex = Math.floor(y / mineObject.block_height);
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
		mineContext.fillStyle = "gray";
		mineContext.fillRect(0, 0, 600, 320);


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
					mineContext.fillStyle = "white";
					mineContext.font = "15px Arial";
					mineContext.textAlign = 'center';
					if (mines[i][j].roundMines !== 0) {
						mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * 20 + 10, mines[i][j].rows * 20 + 15);
					}
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
		var cleanArr = this.cleanArr;
		var selfMine = this;
		maskCanvas.addEventListener("click", function(e) {
			p = getPosition(e);
			index = getMineIndex(p.x, p.y, selfMine);
			maskContext.clearRect(index.xIndex * BLOCK_WIDTH, index.yIndex * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
			if (mines[index.xIndex][index.yIndex].isClicked === false) {
				mines[index.xIndex][index.yIndex].isClicked = true;
				selfMine.count++;
			}

			if (selfMine.count === (480 - 99)) {
				maskContext.clearRect(0, 0, 600, 320);
				alert("you win");
			}
			if (mines[index.xIndex][index.yIndex].isMined === true) {
				maskContext.clearRect(0, 0, 600, 320);
				alert("you lose");
				if (confirm("do you want to play again?"))

				{
					selfMine.init();
				} else

				{
					alert("goodbye");
				}
			} else if (mines[index.xIndex][index.yIndex].roundMines === 0 && mines[index.xIndex][index.yIndex].isMined === false) {
				selfMine.cleanArea(index.xIndex, index.yIndex, selfMine);
				for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
					maskContext.clearRect(cleanArr[i].columns * BLOCK_WIDTH, cleanArr[i].rows * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1)
				}
			}
		}, false);
	},


	init: function() {
		if (document.getElementById("maskCanvas")) {
			document.getElementById("maskCanvas").remove()
		}
		if (document.getElementById("mineCanvas")) {
			document.getElementById("mineCanvas").remove()
		}
		this.mines = [];
		this.cleanArr = [];
		this.count = 0;
		this.createMines();
		this.createMask();
	}



};