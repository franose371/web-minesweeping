<template>
  <rect :x="column" :y="row" width="20px" height="20px" @click="clicked"></rect> 
</template>

<script>
export default {
  name: 'block',
  props: ['row', 'column', 'mine'],
  methods: {
    clicked: function () {
      this.mine.isClicked = true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
rect {
  fill: gray;
  stroke: black;
}

.clicked {
  fill:white;
}
</style>
