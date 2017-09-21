class Mineblock {
	constructor(columns, rows) {
		this.columns = columns;
		this.rows = rows;
		this.isClicked = false; //boolean, default false
		this.isMined = false; //boolean default false
		this.roundMines = 0; //0-8
		this.isClicked = false;
		this.isFlaged = false;
	}
}

export {
	Mineblock
}