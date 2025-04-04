document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverDisplay = document.getElementById('game-over');
    const restartBtn = document.getElementById('restart-btn');
   

    // Game settings
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;
   
    // Game variables
    let snake = [{x: 10, y: 10}];
    let food = {x: 5, y: 5};
    let xVelocity = 0;
    let yVelocity = 0;
    let score = 0;
    let gameRunning = true;
    let gameSpeed = 150;
    let gameLoop;
   
    // Draw functions
    function drawSnake() {
        ctx.fillStyle = 'lime';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
            ctx.strokeStyle = '#111';
            ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
    }
   
    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            food.x * gridSize + gridSize / 2,
            food.y * gridSize + gridSize / 2,
            gridSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
   
    function drawGame() {
        // Clear canvas
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
       
        drawFood();
        drawSnake();
    }
   
    // Game logic
    function moveSnake() {
        const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
       
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
       
        // Check self collision
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
                return;
            }
        }
       
        snake.unshift(head);
       
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            generateFood();
           
            // Increase speed every 5 points
            if (score % 5 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(updateGame, gameSpeed);
            }
        } else {
            snake.pop();
        }
    }
   
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
       
        // Make sure food doesn't appear on snake
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                generateFood();
                return;
            }
        }
    }
   
    function gameOver() {
        gameRunning = false;
        clearInterval(gameLoop);
        gameOverDisplay.style.display = 'flex';
    }
   
    function updateGame() {
        moveSnake();
        drawGame();
    }
   
    function startGame() {
        snake = [{x: 10, y: 10}];
        xVelocity = 0;
        yVelocity = 0;
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameSpeed = 150;
        gameRunning = true;
        gameOverDisplay.style.display = 'none';
        generateFood();
       
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, gameSpeed);
    }
   
    // Event listeners
    document.addEventListener('keydown', (e) => {
        // Prevent reversing direction
        switch(e.key) {
            case 'ArrowUp':
                if (yVelocity === 1) return;
                xVelocity = 0;
                yVelocity = -1;
                break;
            case 'ArrowDown':
                if (yVelocity === -1) return;
                xVelocity = 0;
                yVelocity = 1;
                break;
            case 'ArrowLeft':
                if (xVelocity === 1) return;
                xVelocity = -1;
                yVelocity = 0;
                break;
            case 'ArrowRight':
                if (xVelocity === -1) return;
                xVelocity = 1;
                yVelocity = 0;
                break;
        }
    });
   
    restartBtn.addEventListener('click', startGame);
   
    // Start the game
    startGame();
  });
   