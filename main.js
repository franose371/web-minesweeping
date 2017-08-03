var MineSweeping = {
	mine_num: 99,
	block_width: 20,
	block_height: 20,
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
		for (let i = 0; i < 30; i++) {
			xIndex.push(i);
		}
		for (let i = 0; i < 16; i++) {
			yIndex.push(i);
		}

		for (let i = 0; i < this.mine_num; i++) {
			var randomX = xIndex[Math.floor(Math.random() * 30)];
			var randomY = yIndex[Math.floor(Math.random() * 16)];
			positions.push({
				x: randomX,
				y: randomY
			});
		}
		for (let i = 0; i < positions.length; i++) {
			mineContext.fillStyle = "red"; //填充样式演示
			mineContext.fillRect(positions[i].x * 20, positions[i].y * 20, this.block_width, this.block_height); //绘制矩形
		}
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
		//maskCanvas.style.display = 'block';
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
		for (let x = 0; x < 600; x = x + 20) {
			for (let y = 0; y < 320; y = y + 20) {
				maskContext.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
				maskContext.strokeRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT)
			}
		}

		var getPosition = this.getEventPosition;
		maskCanvas.addEventListener("click", function(e) {
			p = getPosition(e);
			intX = Math.floor(p.x / BLOCK_WIDTH);
			intY = Math.floor(p.y / BLOCK_HEIGHT);
			maskContext.clearRect(intX * BLOCK_WIDTH, intY * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1);
		}, false);
	},


	init: function() {
		this.createMines();
		this.createMask();
	}



};