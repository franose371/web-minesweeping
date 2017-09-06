<template>
  <svg width="600px" height="320px" viewBox= "0 0 600 320">
    <g id="Mine-panel">
      <Block v-for="(mine,index) in mines" :row="mine.row*BLOCK_WIDTH" :column="mine.column*BLOCK_HEIGHT" :mine="mine" :key="index" :class="{clicked: mine.isClicked}"></Block>
    </g>
  </svg>
</template>

<script>
import Block from './components/Block'
import {Mineblock} from './Mineblock'
const BLOCK_WIDTH = 20
const BLOCK_HEIGHT = 20

let row = 16
let column = 30
var mines = []
for (let i = 0; i < column; i++) {
  for (let j = 0; j < row; j++) {
    mines.push(new Mineblock(j, i))
  }
}
export default {
  name: 'app',
  data: function () {
    return {
      mines, BLOCK_WIDTH, BLOCK_HEIGHT, status
    }
  },
  components: {
    Block
  }
}

</script>

<style>

</style>
