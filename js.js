// 全局变量声明
let isPaused = false; // 游戏是否暂停的标志


document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const runButton = document.getElementById('runButton');
    const resetButton = document.getElementById('resetButton');
    const pauseButton = document.getElementById('pauseButton');

    // 动态设置画布尺寸为窗口的50%
    function setCanvasSize() {
        canvas.width = window.innerWidth * 0.5;
        canvas.height = window.innerHeight * 0.5;
    }

    // 初始化画布尺寸
    setCanvasSize();

    // 监听窗口大小变化，调整画布尺寸
    window.addEventListener('resize', setCanvasSize);

    // 按钮点击事件，启动游戏
    runButton.addEventListener('click', () => {
        // 启动游戏
        draw();
        requestAnimationFrame(draw); // 确保游戏循环开始
        runButton.disabled = true;
        pauseButton.disabled = false;
    });

    // 重置按钮点击事件，重置游戏
    resetButton.addEventListener('click', () => {
        resetGame();
    });

    // 暂停按钮点击事件，暂停或继续游戏
    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused; // 切换暂停状态
        if (isPaused) {
            pauseButton.textContent = '继续游戏';
        } else {
            pauseButton.textContent = '暂停游戏';
            draw();
            requestAnimationFrame(draw); // 确保游戏循环继续
        }
    });

    // 游戏变量
    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 12; // 砖块行数
    const brickColumnCount = 8; // 砖块列数
    const brickWidth = 50; // 砖块宽度
    let brickHeight = 20; // 砖块高度
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;
    let lives = 3;
    let isPaused = false; // 游戏是否暂停的标志

    let bricks = [];

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.getBoundingClientRect().left;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            alert("YOU WIN, CONGRATS!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    // 根据列数设置砖块颜色
                    switch (c) {
                        case 0:
                            ctx.fillStyle = "#FF0000"; // 第一列：红色
                            break;
                        case 1:
                            ctx.fillStyle = "#FFA500"; // 第二列：橙色
                            break;
                        case 2:
                            ctx.fillStyle = "#FFFF00"; // 第三列：黄色
                            break;
                        case 3:
                            ctx.fillStyle = "#00FF00"; // 第四列：绿色
                            break;
                        case 4:
                            ctx.fillStyle = "#0000FF"; // 第五列：蓝色
                            break;
                        case 5:
                            ctx.fillStyle = "#4B0082"; // 第六列：靛蓝
                            break;
                        case 6:
                            ctx.fillStyle = "#8A2BE2"; // 第七列：紫色
                            break;
                        case 7:
                            ctx.fillStyle = "#FF69B4"; // 第八列：粉红色
                            break;
                        default:
                            ctx.fillStyle = "#0095DD"; // 默认颜色
                            break;
                    }
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + score, 8, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        if (isPaused) {
            return; // 如果游戏暂停，则不更新画布
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        collisionDetection();

        // 边界检测
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        // 移动挡板
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        // 更新球的位置
        x += dx;
        y += dy;

        // 继续动画循环
        requestAnimationFrame(draw);
    }

    function resetGame() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        rightPressed = false;
        leftPressed = false;
        score = 0;
        lives = 3;
        isPaused = false;
        pauseButton.textContent = '暂停游戏';
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 1;
            }
        }
        runButton.disabled = false;
        pauseButton.disabled = true;
        draw();
    }
});