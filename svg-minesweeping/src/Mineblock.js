class Mineblock {
  constructor(row, column) {
    this.row = row
    this.column = column
    let roundMines = 0;
    this.isClicked = false;
    let isFlaged = false;
    let isMined = false;
  }
  getClicked() {
    return this.isClicked;
  }
  getFlaged() {
    return this.isFlaged;
  }
  getMined() {
    return this.isMined;
  }
  getMines() {
    return this.roundMines;
  }
  setMines(num) {
    this.roundMines = num;
  }
  setClicked() {
    this.isClicked = !this.isClicked;
  }
  setFlaged() {
    this.isFlaged = !this.isFlaged;
  }
  setMined() {
    this.isMined = !this.isMined;
  }
}

export {
  Mineblock
}