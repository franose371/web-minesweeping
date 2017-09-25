import bomb from './images/bomb.jpg'
import bomb0 from './images/bomb0.jpg'
import flag from './images/flag.jpg'
import config from './config.json'
import {
	createData,
	game
} from './data'
import './style.css'

const BLOCK_WIDTH = 20,
	BLOCK_HEIGHT = 20,
	oTimer = document.createElement("div"),
	maskCanvas = document.createElement("canvas"),
	mineCanvas = document.createElement("canvas");

var mine_num,
	panel_columns,
	panel_rows,
	mines = [],
	count = 0,
	timeCount,
	firstClick = [],
	flagContext,
	maskContext,
	mineContext,
	myTime,
	isMouseDown = false,
	isDoubleMouseDown = false,
	wrongedMineIndex = [],
	imgObjects = [];

//图片预加载
function loadImage(imgList) {
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
}

function setTimer(isFinished) {
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
}

function setMineNum(level) {
	if (level) {
		var curLevel = config[level];
		mine_num = curLevel["mine_num"];
		panel_rows = curLevel["panel_rows"];
		panel_columns = curLevel["panel_columns"];
	}
}

//清除遮罩层
function cleanMask(columns, rows) {
	maskContext.clearRect(0, 0, panel_columns * BLOCK_WIDTH, panel_rows * BLOCK_HEIGHT);
	mineContext.drawImage(imgObjects[1], columns * BLOCK_WIDTH + 1, rows * BLOCK_HEIGHT + 1, BLOCK_WIDTH - 2, BLOCK_HEIGHT - 2);
	maskCanvas.remove();
	setTimer(true);
}


//得到当前索引
function getMineIndex(x, y) {
	return x > 0 && y > 0 && x < panel_columns * BLOCK_WIDTH - 1 && y < panel_rows < panel_rows * BLOCK_HEIGHT - 1 ? {
		xIndex: Math.floor(x / BLOCK_WIDTH),
		yIndex: Math.floor(y / BLOCK_HEIGHT)
	} : false;
}

//得到当前鼠标在面板上的偏移
function getEventPosition(ev) {
	return {
		x: ev.clientX - parseInt(maskCanvas.offsetLeft),
		y: ev.clientY - parseInt(maskCanvas.offsetTop)
	};
}

function handleClick(e) {
	if (e.type === "mouseup") {
		isDoubleMouseDown ? handleDoubleClick(e) : handleSingleClick(e);
	}
}

//左右键同时按下
function handleDoubleClick(event) {
	if (mines.length > 0) {
		var p = getEventPosition(event, maskCanvas);
		var i = getMineIndex(p.x, p.y);
		var columns = i.xIndex;
		var rows = i.yIndex;
		var cur = mines[i.xIndex][i.yIndex];
		if (cur.isClicked) {
			var flagNum = game.getFlaged(columns, rows);
			if (flagNum === cur.roundMines) {
				var cleanArr = game.cleanArea(i.xIndex, i.yIndex, []);
				if (cleanArr) {
					cleanArr.map((item) => {
						mines[item.columns][item.rows].isClicked = true;
					});
					count += cleanArr.length;
					wrongedMineIndex = game.getWronged(cleanArr);
					var isGameLose = game.isGameLose;
					for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
						clearBlock(cleanArr[i].columns, cleanArr[i].rows, -1, -1);
					}
				}
			}
			if (isGameLose) {
				cleanMask(wrongedMineIndex[0].xIndex, wrongedMineIndex[0].yIndex);
			}
			if (count === panel_columns * panel_rows - mine_num) {
				cleanMask();
				setTimer(true);
				alert("you win! time:" + parseInt(oTimer.innerHTML) + "s");
			}
		}
		isMouseDown = false;
		isDoubleMouseDown = false;
	}
}

function clearBlock(column, row, xOffSet, yOffSet) {
	maskContext.clearRect(column * BLOCK_WIDTH, row * BLOCK_HEIGHT, BLOCK_WIDTH + xOffSet, BLOCK_HEIGHT + yOffSet);
}

function handleRightClick(p, i) {
	var cur = mines[i.xIndex][i.yIndex];
	if (i && count !== 0 && !cur.isClicked) {
		if (!cur.isFlaged) {
			cur.isFlaged = true;
			maskContext.drawImage(imgObjects[2], i.xIndex * BLOCK_WIDTH + 1, i.yIndex * BLOCK_HEIGHT + 1, BLOCK_WIDTH - 2, BLOCK_HEIGHT - 2);
		} else if (cur.isFlaged) {
			cur.isFlaged = false;
			drawBlock(maskContext, "#c2c2c2", "white", i.xIndex * BLOCK_WIDTH, i.yIndex * BLOCK_HEIGHT, BLOCK_WIDTH, BLOCK_HEIGHT);
		}
		return false;
	}
}

//左键按下
function handleLeftClick(p, i) {
	var cur = mines[i.xIndex][i.yIndex];
	if (!cur.isFlaged) {
		clearBlock(i.xIndex, i.yIndex, -1, -1);
		//当前块被点击时，isClicked改为true
		if (!cur.isClicked && !cur.isMined) {
			cur.isClicked = true;
			count++;
		}
		//胜利的条件
		if (count === panel_columns * panel_rows - mine_num) {
			maskContext.clearRect(0, 0, panel_columns * BLOCK_WIDTH, panel_rows * BLOCK_HEIGHT);
			maskCanvas.remove();
			setTimer(true);
			alert("you win! time:" + parseInt(oTimer.innerHTML) + "s");
		}
		//点击到雷时
		if (cur.isMined && !cur.isClicked) {
			cleanMask(i.xIndex, i.yIndex);
		} else if (cur.roundMines === 0 && !cur.isMined) {
			var cleanArr = game.cleanArea(i.xIndex, i.yIndex, []);
			if (cleanArr) {
				count += cleanArr.length;
				for (var i = 0, length1 = cleanArr.length; i < length1; i++) {
					clearBlock(cleanArr[i].columns, cleanArr[i].rows, -1, -1)
				}
				if (count === panel_columns * panel_rows - mine_num) {
					maskContext.clearRect(0, 0, panel_columns * BLOCK_WIDTH, panel_rows * BLOCK_HEIGHT);
					maskCanvas.remove();
					alert("you win! time: " + parseInt(oTimer.innerHTML) + "s");
				}
			}
		}
	}
}

//只有一个键被按下
function handleSingleClick(event) {
	var p = getEventPosition(event, maskCanvas);
	var i = getMineIndex(p.x, p.y);
	if (maskCanvas && i) {
		if (event.button === 0) {
			if (count === 0) {
				//第一次点击时，生成雷
				firstClick.push(i.xIndex);
				firstClick.push(i.yIndex);
				createMines(firstClick);
				setTimer(false);
			}
			handleLeftClick(p, i);
		} else if (event.button === 2) {
			handleRightClick(p, i);
		}
	}

}

function drawText(color, column, row) {
	mineContext.fillStyle = color;
	mineContext.fillText(mines[column][row].roundMines, mines[column][row].columns * BLOCK_WIDTH + 10, mines[column][row].rows * BLOCK_HEIGHT + 15);
}

function isOutRange(column, row) {
	return (column > -1 && row > -1 && column < panel_columns && row < panel_rows) ? false : true;
}

function drawBlock(context, fillColor, strokeColor, xPos, yPos, width, height) {
	context.fillStyle = fillColor;
	context.strokeStyle = strokeColor;
	context.fillRect(xPos, yPos, width, height);
	context.strokeRect(xPos, yPos, width, height);
}

function createMines(firstClick) {
	//创造地雷层的canvas

	mineCanvas.id = "mineCanvas";
	mineCanvas.width = panel_columns * BLOCK_WIDTH;
	mineCanvas.height = panel_rows * BLOCK_HEIGHT;
	document.body.appendChild(mineCanvas);

	mineCanvas.getContext("2d") ? mineContext = mineCanvas.getContext("2d") : alert("浏览器不兼容");

	//背景填充
	for (var x = 0; x < panel_columns * BLOCK_WIDTH; x = x + BLOCK_WIDTH) {
		for (var y = 0; y < panel_rows * BLOCK_HEIGHT; y = y + BLOCK_HEIGHT) {
			drawBlock(mineContext, '#D3D3D3', 'white', x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
		}
	}

	mines = createData(firstClick, panel_columns, panel_rows, mine_num);

	for (let i = 0, length1 = mines.length; i < length1; i++) {
		for (let j = 0, length2 = mines[i].length; j < length2; j++) {
			if (mines[i][j].isMined === true) {
				mineContext.drawImage(imgObjects[0], mines[i][j].columns * BLOCK_WIDTH, mines[i][j].rows * BLOCK_HEIGHT);
			}
			if (mines[i][j].roundMines !== 0 && !mines[i][j].isMined) {
				//绘制不同颜色的数字
				mineContext.font = "15px Arial";
				mineContext.textAlign = 'center';
				const color = ["blue", "green", "red", "#4B0082", "#A0522D", "#00CED1", "black", "gray"];
				let textColor = color[mines[i][j].roundMines - 1]
				drawText(textColor, i, j);
			}
		}
	}
}

//创建遮罩层
function createMask() {
	maskCanvas.id = "maskCanvas";
	maskCanvas.width = panel_columns * BLOCK_WIDTH;
	maskCanvas.height = panel_rows * BLOCK_HEIGHT;

	document.body.appendChild(maskCanvas);

	maskCanvas.getContext("2d") ? maskContext = maskCanvas.getContext("2d") : alert("浏览器不兼容");

	for (var x = 0; x < panel_columns * BLOCK_WIDTH; x = x + BLOCK_WIDTH) {
		for (var y = 0; y < panel_rows * BLOCK_HEIGHT; y = y + BLOCK_HEIGHT) {
			drawBlock(maskContext, '#c2c2c2', 'white', x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
		}
	}
}

maskCanvas.addEventListener("mouseup", function(e) {
	isMouseDown = false;
	handleClick(e);
}, false);
maskCanvas.addEventListener("mousedown", function(e) {
	if (isMouseDown) {
		isDoubleMouseDown = true;
	} else {
		isMouseDown = true;
	}
}, false);



//生成计时器和开始按钮节点
function createInfo() {
	var mask = document.getElementById("maskCanvas");
	var oInfo = document.createElement("div");
	oInfo.id = "minesweeping-info-block";
	oInfo.style.top = parseInt(mask.offsetTop) + (panel_rows * BLOCK_HEIGHT) / 2 + 'px';

	oTimer.id = "minesweeping-info-timer";
	oTimer.innerHTML = "000";

	var oButton = document.createElement("button");
	oButton.id = "minesweeping-info-button";
	oButton.innerHTML = "start";

	oInfo.appendChild(oTimer);
	oInfo.appendChild(oButton);
	document.body.insertBefore(oInfo, mask);

	oButton.addEventListener("click", function() {
		init();
		setTimer(true);
	}, false);
};

function init(level) {
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
	count = 0;
	timeCount = 0;
	firstClick = [];
	wrongedMineIndex = [];
	isDoubleMouseDown = false;
	isMouseDown = false;
	setTimer(true);
	//预加载图片
	loadImage([bomb, bomb0, flag]);
	//禁止右键事件
	document.oncontextmenu = function(e) {
		return false;
	}
	setMineNum(level);
	createMask();
	createInfo();
}

function setLevel() {
	//默认显示初级扫雷
	init("beginner");
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
		init(target.value);
	}, false);


}

setLevel();

export {
	isOutRange,
	mines
}