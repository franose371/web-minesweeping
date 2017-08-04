function Mineblock (cloumns, rows) {
	this.cloumns = cloumns;
	this.rows = rows;
	this.isClicked = false;//boolean, default false
	this.isMined = false;//boolean default false
	this.roundMines = 0;//0-8

	this.hasClicked = hasClicked;
	function hasClicked () {
		this.isClicked = true;
	}
	this.hasMined = hasMined;
	function hasMined () {
		this.isMined = true;
	}

	function setMinesNum (num) {
		this.roundMines = num;
	}

}
