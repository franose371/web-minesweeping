import {
	Mineblock
} from './Mineblock'
import {
	isOutRange,
	mines
} from './index'

function createData(firstClick, panel_columns, panel_rows, mine_num) {
	var mines = [];
	var xIndex = [];
	var yIndex = [];
	var positions = [];
	//创建二维数组mines
	mines = new Array(panel_columns);
	for (let i = 0, length1 = mines.length; i < length1; i++) {
		mines[i] = new Array(panel_rows);
	}
	for (let i = 0, length = mines.length; i < length; i++) {
		for (let j = 0, length2 = mines[i].length; j < length2; j++) {
			mines[i][j] = new Mineblock(i, j);
		}
	}
	//生成所有可能的坐标索引
	for (let i = 0; i < panel_columns; i++) {
		for (var j = 0; j < panel_rows; j++) {
			positions.push({
				x: i,
				y: j
			});
		}
	}
	positions.splice(firstClick[0] * panel_rows + firstClick[1], 1);

	//在所有可能的坐标中选出不重复的坐标
	var positionLength = positions.length;
	for (let i = 0; i < mine_num; i++) {
		let index = Math.floor(Math.random() * positionLength);
		let position = positions[index];
		let x = position.x;
		let y = position.y;
		mines[x][y].isMined = true;
		positions[index] = positions[positionLength - 1];
		positionLength--;
	}
	//遍历得到每个格子里的数字
	var mineNum;
	for (let i = 0, length3 = mines.length; i < length3; i++) {
		for (let j = 0, length4 = mines[i].length; j < length4; j++) {
			mineNum = 0;
			for (var k = -1; k < 2; k++) {
				for (var l = -1; l < 2; l++) {
					if (!isOutRange(i + l, j + k) && mines[i + l][j + k].isMined) {
						mineNum++;
					}
				}
			}
			mines[i][j].roundMines = mineNum;
		}
	}
	return mines;
}

var game = {
	//清除当前点击块周围的块
	arr: [],
	isGameLose: false,
	loop: function(col, row, arr) {
		for (var k = -1; k < 2; k++) {
			for (var l = -1; l < 2; l++) {
				if (!isOutRange(col + l, row + k)) {
					let cur = mines[col + l][row + k];
					if (!cur.isClicked) {
						if (!cur.isFlaged) {
							arr.push({
								columns: col + l,
								rows: row + k
							});
							mines[col + l][row + k].isClicked = true;
						}
						if (cur.roundMines === 0) {
							this.loop(col + l, row + k, arr);
						}
					}
				}
			}
		}
	},
	cleanArea: function(columns, rows, cleanArr) {
		this.loop(columns, rows, cleanArr);
		this.arr = cleanArr;
		if (cleanArr.length > 0) {
			return cleanArr;
		}
	},
	getWronged: function(arr) {
		var wrongedIndex = [];
		arr.map((item) => {
			var cur = mines[item.columns][item.rows];
			if (cur.isClicked && cur.isMined && !cur.isFlaged) {
				wrongedIndex.push({
					xIndex: item.columns,
					yIndex: item.rows
				});
			}
		});
		if (wrongedIndex.length > 0) {
			this.isGameLose = true;
			return wrongedIndex;
		} else {
			this.isGameLose = false;
			return wrongedIndex;
		}
	},
	getFlaged: function(col, row) {
		var flagNum = 0;
		if (mines[col][row].isClicked) {
			[-1, 0, 1].map((rows) => {
				[-1, 0, 1].map((cols) => {
					!isOutRange(col + cols, row + rows) ? (mines[col + cols][row + rows].isFlaged ? flagNum++ : flagNum) : flagNum;
				});
			});
		}
		return flagNum;
	}
}

export {
	createData,
	game
}