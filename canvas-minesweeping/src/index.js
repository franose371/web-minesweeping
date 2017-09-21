import bomb from './images/bomb.jpg'
import bomb0 from './images/bomb0.jpg'
import flag from './images/flag.jpg'
import config from './config.json'
import {
	createData,
} from './data'
import './style.css'


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
MineSweeping.loadImage = function(imgList) {
	var count = 0;
	for (var i = 0, length1 = imgList.length; i < length1; i++) {
		window['img' + i] = new Image();
		window['img' + i].src = imgList[i];
		window['img' + i].onload = function(i) {
			count++;
			imgObjects.push(window['img' + i]);
			window['img' + i].onload = null;
		}(i);
	}
	return count === imgList.length ? true : false;
};

MineSweeping.setTimer = function(isFinished) {
	var timeText;

	function settime() {
		timeCount = timeCount + 1
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
MineSweeping.setMineNum = function(level) {
	if (level) {
		var curLevel = config[level];
		mine_num = curLevel["mine_num"];
		panel_rows = curLevel["panel_rows"];
		panel_columns = curLevel["panel_columns"];
	}
};

//清除遮罩层
MineSweeping.cleanMask = function(columns, rows) {
	maskContext.clearRect(0, 0, panel_columns * block_width, panel_rows * block_height);
	mineContext.drawImage(imgObjects[1], columns * block_width + 1, rows * block_height + 1, block_width - 2, block_height - 2);
	maskCanvas.remove();
	MineSweeping.setTimer(true);
};
//清除当前点击块周围的块
MineSweeping.cleanArea = function(columns, rows, mineObject) {
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
MineSweeping.getMineIndex = function(x, y, mineObject) {
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

MineSweeping.getEventPosition = function(ev, parentEle) {
	var x, y;
	x = ev.clientX - parseInt(maskCanvas.offsetLeft);
	y = ev.clientY - parseInt(maskCanvas.offsetTop);
	return {
		x: x,
		y: y
	};
};

MineSweeping.handleClick = function(e, self) {
	var p = self.getEventPosition(e, maskCanvas);
	var i = self.getMineIndex(p.x, p.y, self);
	if (e.type === "mouseup") {
		isDoubleMouseDown ? MineSweeping.handleDoubleClick(e, self) : MineSweeping.handleSingleClick(e, self);
	}
};

//左右键同时按下
MineSweeping.handleDoubleClick = function(event, self) {
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
MineSweeping.clearBlock = function(column, row, xOffSet, yOffSet) {
	maskContext.clearRect(column * block_width, row * block_height, block_width + xOffSet, block_height + yOffSet);
};
//只有一个键被按下
MineSweeping.handleSingleClick = function(event, self) {
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
						MineSweeping.clearBlock(cleanArr[i].columns, cleanArr[i].rows, -1, -1)
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

MineSweeping.drawText = function(color, column, row) {
	mineContext.fillStyle = color;
	mineContext.fillText(mines[column][row].roundMines, mines[column][row].columns * block_width + 10, mines[column][row].rows * block_height + 15);
};

MineSweeping.isOutRange = function(column, row) {
	return (column > -1 && row > -1 && column < panel_columns && row < panel_rows) ? false : true;
};

MineSweeping.drawBlock = function(context, fillColor, strokeColor, xPos, yPos, width, height) {
	context.fillStyle = fillColor;
	context.strokeStyle = strokeColor;
	context.fillRect(xPos, yPos, width, height);
	context.strokeRect(xPos, yPos, width, height);
};

MineSweeping.createMines = function(firstClick) {
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

	mines = createData(firstClick, panel_columns, panel_rows, mine_num);

	for (let i = 0, length1 = mines.length; i < length1; i++) {
		for (let j = 0, length2 = mines[i].length; j < length2; j++) {
			if (mines[i][j].isMined === true) {
				mineContext.drawImage(imgObjects[0], mines[i][j].columns * block_width, mines[i][j].rows * block_height);
			}
			if (mines[i][j].roundMines !== 0 && !mines[i][j].isMined) {
				//绘制不同颜色的数字
				mineContext.font = "15px Arial";
				mineContext.textAlign = 'center';
				const color = ["blue", "green", "red", "#4B0082", "#A0522D", "#00CED1", "black", "gray"];
				let textColor = color[mines[i][j].roundMines - 1]
				MineSweeping.drawText(textColor, i, j);
			}
		}
	}
};
MineSweeping.createMask = function() {
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

	maskCanvas.addEventListener("mouseup", function(e) {
		isMouseDown = false;
		selfMine.handleClick(e, selfMine);
	}, false);
	maskCanvas.addEventListener("mousedown", function(e) {
		if (isMouseDown) {
			isDoubleMouseDown = true;
		} else {
			isMouseDown = true;
		}
	}, false);
};

//生成计时器和开始按钮节点
MineSweeping.createInfo = function() {
	var mask = document.getElementById("maskCanvas");
	var oInfo = document.createElement("div");
	oInfo.id = "minesweeping-info-block";
	oTimer = document.createElement("div");
	oTimer.id = "minesweeping-info-timer";
	oTimer.innerHTML = "000";

	var oButton = document.createElement("button");
	oButton.id = "minesweeping-info-button";
	oButton.innerHTML = "start";

	oInfo.appendChild(oTimer);
	oInfo.appendChild(oButton);
	document.body.insertBefore(oInfo, mask);
	oInfo.style.top = parseInt(mask.offsetTop) + (panel_rows * block_height) / 2 + 'px';
	oButton.addEventListener("click", function() {
		MineSweeping.init();
		MineSweeping.setTimer(true);
	}, false);
};

MineSweeping.init = function(level) {
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
	MineSweeping.loadImage([bomb, bomb0, flag]);
	//禁止右键事件
	document.oncontextmenu = function(e) {
		return false;
	}
	this.setMineNum(level);
	this.createMask();
	this.createInfo();
};

MineSweeping.setLevel = function() {
	//默认显示初级扫雷
	MineSweeping.init("beginner");
	var oInfo = document.createElement("span");
	oInfo.innerHTML = "请选择难度：";
	var oSel = document.createElement("select");
	//根据屏幕宽度显示可选择的级别
	if (screen.width < 430) {
		oSel.innerHTML = `<option value="beginner">初级</option>`;
	} else if (screen.width < 710) {
		oSel.innerHTML = `  <option value="beginner">初级</option>
							<option value ="intermediate">中级</option>
								`;
	} else {
		oSel.innerHTML = `  <option value="beginner">初级</option>
							<option value ="intermediate">中级</option>
							<option value ="expert">高级</option>
							`;
	}
	document.body.appendChild(oInfo);
	document.body.appendChild(oSel);
	oSel.addEventListener("change", function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement;
		MineSweeping.init(target.value);
	}, false);


}

MineSweeping.setLevel();

//window.MineSweeping = MineSweeping;

const isOutRange = MineSweeping.isOutRange;

export {
	isOutRange
}