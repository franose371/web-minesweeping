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
		var minepositions = [];
		//生成所有可能的坐标索引
		for (let i = 0; i < 30; i++) {
			for (let j = 0; j < 16; j++) {
				positions.push({
					x: i,
					y: j
				});
			}
		}

		//在所有可能的坐标中选出99个不重复的坐标
		while (minepositions.length < 99) {
			let index = Math.floor(Math.random() * positions.length);
			let position = positions[index];
			minepositions.push(position);
			positions.splice(index, 1);
		}

		for (let i = 0; i < minepositions.length; i++) {
			mineContext.fillStyle = "red"; //填充样式演示
			mineContext.fillRect(minepositions[i].x * 20, minepositions[i].y * 20, this.block_width, this.block_height); //绘制矩形
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
		for (let x = 0; x < 600; x = x + BLOCK_WIDTH) {
			for (let y = 0; y < 320; y = y + BLOCK_HEIGHT) {
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