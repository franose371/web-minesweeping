(function() {

	function Mineblock(cloumns, rows) {
		this.cloumns = cloumns;
		this.rows = rows;
		this.isClicked = false; //boolean, default false
		this.isMined = false; //boolean default false
		this.roundMines = 0; //0-8
		this.isClicked = false;
		this.isFlaged = false;
	}
	window.Mineblock = Mineblock;
	var MineSweeping = {};
	var mine_num = 99;
	var block_width = 20;
	var block_height = 20;
	var panel_cloumns = 30;
	var panel_rows = 16;
	var mines = [];
	var cleanArr = [];
	var count = 0;
	var firstClick = [];
	var flagContext;
	var maskContext;

	MineSweeping.getCount = function() {
		return count;
	};

	MineSweeping.setMineNum = function(mine_number) {
		switch (mine_number) {
			case 10:
				panel_cloumns = 8;
				panel_rows = 8;
				mine_num = mine_number;
				break;
			case 40:
				panel_cloumns = 16;
				panel_rows = 16;
				mine_num = mine_number;
				break;
			case 99:
				panel_cloumns = 30;
				panel_rows = 16;
				mine_num = mine_number;
				break;
		}
	};

	MineSweeping.handleClick = function(e, self) {
		switch (e.type) {
			case "mousedown":
				MineSweeping.handleSingleClick(event, self);
				break;
		}
	};

	MineSweeping.cleanArea = function(columns, rows, mineObject) {
		for (let k = -1; k < 2; k++) {
			for (let l = -1; l < 2; l++) {
				if (columns + l > -1 && rows + k > -1 && columns + l < panel_cloumns && rows + k < panel_rows && mines[columns + l][rows + k].isClicked === false) {
					cleanArr.push({
						columns: columns + l,
						rows: rows + k
					});
					mines[columns + l][rows + k].isClicked = true;
					count++;
					if (mines[columns + l][rows + k].roundMines === 0) {
						mineObject.cleanArea(columns + l, rows + k, mineObject);
					}
				}
			}
		}
	};
	MineSweeping.getMineIndex = function(x, y, mineObject) {
		if (x > 0 && y > 0 && x < panel_cloumns * block_width - 1 && y < panel_rows < panel_rows * block_height - 1) {
			var xIndex = Math.floor(x / block_width);
			var yIndex = Math.floor(y / block_height);
			return {
				xIndex: xIndex,
				yIndex: yIndex
			}
		} else {
			return false;
		}
	};
	MineSweeping.getEventPosition = function(ev, parentEle) {
		var x, y;
		if (ev.layerX || ev.layerX == 0) {
			x = ev.layerX;
			y = ev.layerY;
			//y = ev.layerY - parentEle.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera  
			x = ev.offsetX;
			y = ev.offsetY;
		}
		return {
			x: x,
			y: y
		}
	};
	//左右键同时按下
	MineSweeping.handleDoubleClick = function(event, self) {
		p = self.getEventPosition(event, maskCanvas);
		index = self.getMineIndex(p.x, p.y, self);

	};
	//只有一个键被按下
	MineSweeping.handleSingleClick = function(event, self) {
		var p = self.getEventPosition(event, maskCanvas);
		var index = self.getMineIndex(p.x, p.y, self);
		//左键点击事件
		if (event.button === 0) {
			if (index) {
				//第一次点击时，生成雷
				if (count === 0) {
					firstClick.push(index.xIndex);
					firstClick.push(index.yIndex);
					self.createMines();
				}

				if (mines[index.xIndex][index.yIndex].isFlaged !== true) {
					maskContext.clearRect(index.xIndex * block_width, index.yIndex * block_height, block_width - 1, block_height - 1);
					//当前块被点击时，isClicked改为true
					if (mines[index.xIndex][index.yIndex].isClicked === false && mines[index.xIndex][index.yIndex].isMined === false) {
						mines[index.xIndex][index.yIndex].isClicked = true;
						count++;
					}
					//胜利的条件
					if (count === (panel_cloumns * panel_rows - mine_num)) {
						maskContext.clearRect(0, 0, panel_cloumns * block_width, panel_rows * block_height);
						alert("you win");
					}
					if (mines[index.xIndex][index.yIndex].isMined === true) {
						maskContext.clearRect(0, 0, panel_cloumns * block_width, panel_rows * block_height);
						alert("you lose");
						if (confirm("do you want to play again?"))

						{
							self.init();
						} else

						{
							alert("goodbye");
						}
					} else if (mines[index.xIndex][index.yIndex].roundMines === 0 && mines[index.xIndex][index.yIndex].isMined === false) {
						self.cleanArea(index.xIndex, index.yIndex, self);
						for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
							maskContext.clearRect(cleanArr[i].columns * block_width, cleanArr[i].rows * block_height, block_width - 1, block_height - 1)
						}
					}

				}

			}
		}
		//右键点击事件 
		else if (event.button === 2) {
			if (index) {
				if (count !== 0) {
					if (mines[index.xIndex][index.yIndex].isClicked === false) {
						if (mines[index.xIndex][index.yIndex].isFlaged === false) {
							mines[index.xIndex][index.yIndex].isFlaged = true;
							var img = new Image();
							img.src = "images/flag.jpg";
							img.onload = function() {
								maskContext.drawImage(img, index.xIndex * block_width + 1, index.yIndex * block_height + 1, block_width - 2, block_height - 2);
							};

						} else {
							mines[index.xIndex][index.yIndex].isFlaged = false;
							maskContext.fillStyle = "#c2c2c2";
							maskContext.strokeStyle = 'white'
							maskContext.fillRect(index.xIndex * block_width, index.yIndex * block_height, block_width, block_height);
							maskContext.strokeRect(index.xIndex * block_width, index.yIndex * block_height, block_width, block_height);
						}
						return false;
					}
				}

			}
		}
	};
	//在网页中显示信息
	MineSweeping.createInfo = function() {
		var mask = document.getElementById("maskCanvas");
		var oInfo = document.createElement("div");
		oInfo.id = "minesweeping-info-block";
		var oStatus = document.createElement("div");
		oStatus.id = "minesweeping-info-status";
		oStatus.innerHTML = "nihao";
		oInfo.appendChild(oStatus);
		document.body.insertBefore(oInfo, mask);
		oInfo.style.position = 'absolute';
		oInfo.style.top = panel_rows * block_height + 'px';
	};
	//创建地雷层，设置99个雷
	MineSweeping.createMines = function() {
		//创造地雷层的canvas
		var mineCanvas = document.createElement("canvas");
		mineCanvas.id = "mineCanvas";
		mineCanvas.width = panel_cloumns * block_width;
		mineCanvas.height = panel_rows * block_height;
		mineCanvas.style.border = '1px solid #aaa';
		mineCanvas.style.position = 'absolute'
		mineCanvas.style.margin = 'auto';
		mineCanvas.style.zIndex = '98';
		mineCanvas.style.left = '0';
		mineCanvas.style.top = '0';

		document.body.appendChild(mineCanvas);

		if (mineCanvas.getContext("2d")) {
			var mineContext = mineCanvas.getContext("2d");
		} else {
			alert("浏览器不兼容");
		}

		//背景填充
		mineContext.fillStyle = "#D3D3D3";
		mineContext.strokeStyle = 'white'
		mineContext.lineWidth = 1; //边框宽度
		for (let x = 0; x < panel_cloumns * block_width; x = x + block_width) {
			for (let y = 0; y < panel_rows * block_height; y = y + block_height) {
				mineContext.fillRect(x, y, block_width, block_height);
				mineContext.strokeRect(x, y, block_width, block_height);
			}
		}


		var xIndex = [];
		var yIndex = [];
		var positions = [];
		//创建二维数组mines
		mines = new Array(panel_cloumns);
		for (let i = 0, length1 = mines.length; i < length1; i++) {
			mines[i] = new Array(panel_rows);
		}

		for (let i = 0, length1 = mines.length; i < length1; i++) {
			for (let j = 0, length1 = mines[i].length; j < length1; j++) {
				mines[i][j] = new Mineblock(i, j);
			}
		}
		//生成所有可能的坐标索引
		for (let i = 0; i < panel_cloumns; i++) {
			for (let j = 0; j < panel_rows; j++) {
				positions.push({
					x: i,
					y: j
				});
			}
		}
		positions.splice((firstClick[0] * panel_rows + firstClick[1]), 1);

		//在所有可能的坐标中选出不重复的坐标

		for (let i = 0; i < mine_num; i++) {
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
						if (i + l > -1 && j + k > -1 && i + l < panel_cloumns && j + k < panel_rows) {
							if (mines[i + l][j + k].isMined === true) {
								mineNum++;
							}
						}
					}
				}
				mines[i][j].roundMines = mineNum;
			}
		}
		// var mineImg = new Image();
		// var blockImg = new Image();
		for (let i = 0; i < mines.length; i++) {
			for (let j = 0; j < mines[i].length; j++) {
				if (mines[i][j].isMined === true) {
					var img = new Image();
					img.src = "images/bomb.jpg";
					img.onload = function() {
							mineContext.drawImage(img, mines[i][j].cloumns * block_width, mines[i][j].rows * block_height);
						}
						//mineContext.drawImage("images/bomb.jpg", mines[i][j].cloumns * block_width, mines[i][j].rows * block_height);
						// mineContext.fillStyle = "red";
						// mineContext.fillRect(mines[i][j].cloumns * block_width, mines[i][j].rows * block_height, block_width, block_height); //绘制矩形
				}
				if (mines[i][j].roundMines !== 0 && mines[i][j].isMined === false) {
					//mineContext.fillStyle = "white";
					mineContext.font = "15px Arial";
					mineContext.textAlign = 'center';
					switch (mines[i][j].roundMines) {
						case 1:
							mineContext.fillStyle = "blue";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 2:
							mineContext.fillStyle = "green";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 3:
							mineContext.fillStyle = "red";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 4:
							mineContext.fillStyle = "#4B0082";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 5:
							mineContext.fillStyle = "#A0522D";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 6:
							mineContext.fillStyle = "#00CED1";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 7:
							mineContext.fillStyle = "black";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;
						case 8:
							mineContext.fillStyle = "gray";
							mineContext.fillText(mines[i][j].roundMines, mines[i][j].cloumns * block_width + 10, mines[i][j].rows * block_height + 15);
							break;

					}

				}
			}
		}
	};
	MineSweeping.createMask = function() {
		//const BLOCK_WIDTH = this.block_width;
		//const BLOCK_HEIGHT = this.block_height;
		//创造遮罩层的canvas
		var maskCanvas = document.createElement("canvas");
		maskCanvas.id = "maskCanvas";
		maskCanvas.width = panel_cloumns * block_width;
		maskCanvas.height = panel_rows * block_height;
		maskCanvas.style.border = '1px solid #aaa';
		maskCanvas.style.position = 'absolute'
		maskCanvas.style.zIndex = '99';
		maskCanvas.style.left = '0';
		maskCanvas.style.top = '0';
		//maskCanvas.style.marginTop = '100px';

		document.body.appendChild(maskCanvas);

		if (maskCanvas.getContext("2d")) {
			maskContext = maskCanvas.getContext("2d");
		} else {
			alert("浏览器不兼容");
		}

		maskContext.fillStyle = "#c2c2c2";
		maskContext.strokeStyle = 'white'
		maskContext.lineWidth = 1; //边框宽度
		for (let x = 0; x < panel_cloumns * block_width; x = x + block_width) {
			for (let y = 0; y < panel_rows * block_height; y = y + block_height) {
				maskContext.fillRect(x, y, block_width, block_height);
				maskContext.strokeRect(x, y, block_width, block_height);
			}
		}

		var getPosition = this.getEventPosition;
		var getMineIndex = this.getMineIndex;
		//var cleanArr = this.cleanArr;
		var selfMine = this;

		// maskCanvas.ondblclick = function () {
		// 	alert("dblclick");
		// };
		maskCanvas.addEventListener("mousedown", function(e) {
			selfMine.handleClick(e, selfMine);
		}, false);
	};


	MineSweeping.init = function(mine_number) {
		if (document.getElementById("maskCanvas")) {
			document.getElementById("maskCanvas").remove()
		}
		if (document.getElementById("mineCanvas")) {
			document.getElementById("mineCanvas").remove()
		}
		mines = [];
		cleanArr = [];
		count = 0;
		//禁止右键点击弹出菜单事件
		document.oncontextmenu = new Function("event.returnValue=false;");
		document.onselectstart = new Function("event.returnValue=false;");
		this.setMineNum(mine_number);
		this.createMask();
		this.createInfo();
	};
	window.MineSweeping = MineSweeping;
})();