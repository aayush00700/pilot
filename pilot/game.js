

document.querySelector('.start').addEventListener('click', () => {
    // Replace innerHTML of .container with game elements
    document.querySelector('.container').innerHTML = `
        <div class="highScore"></div>
        <div class="score"></div>
        <canvas id="gameCanvas" width="800" height="700"></canvas>
        <div class="controls">
            <button class="moveLeft">left</button>
            <button class="moveRight">right</button>
            <button class="shoot">fire</button>
        </div>
    `;

    // Clear the .startTemp element by setting its innerHTML to an empty string
    document.querySelector('.startTemp').innerHTML = '';
    
    // Call your game function (assuming it's defined in game.js)
    game();
});







function game(){

    let score = 0
    let src = null
    let highScore = localStorage.getItem('hScore') || 0;

    showScore()
    showHighScore()
    

    const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Set up colors
        const BLACK = '#000000';
        const RED = '#FF0000';
        const YELLOW = '#FFAA1D';
        const PURPLE = '#A020F0';

        // Plane parameters
        let planeSize = 30;  // Base size of the triangle
        let planeColor = RED;
        let planeX = (canvas.width - planeSize) / 2;  // Start position centered horizontally
        let planeY = canvas.height - planeSize - 30;  // Start position above the frame
        let planeSpeed = 5;  // Movement speed of the plane

        // Lists to store active bullets and megaTrons
        let bullets = [];
        let megaTrons = [];

        // Function to shoot a bullet
        function shoot(posX, posY) {
            let bulletWidth = 5;
            let bulletHeight = 10;
            let bulletX = posX + (planeSize / 2) - (bulletWidth / 2);
            let bulletY = posY - bulletHeight;

            // Add bullet to the list
            bullets.push({ x: bulletX, y: bulletY });
        }

        // Function to move and draw bullets
        function moveBullets() {
            // Update and draw bullets
            bullets = bullets.filter(bullet => {
                bullet.y -= 30;  // Move bullet upward
                ctx.fillStyle = YELLOW;
                ctx.fillRect(bullet.x, bullet.y, 5, 10);

                // Remove bullets that have reached the top of the screen
                return bullet.y > 0;
            });
        }

        // Function to spawn megaTrons
        function spawnMegaTrons() {
            let circleX = Math.floor(Math.random() * (canvas.width - 200)) + 100;
            let circleY = 30;
            let color = PURPLE;
            megaTrons.push({ x: circleX, y: circleY, hits: 0, color: color });
        }

        // Function to move and draw megaTrons
        function moveMegaTrons() {
            // Update and draw megaTrons
            megaTrons = megaTrons.filter(trone => {
                trone.y += 3;
                ctx.beginPath();
                ctx.arc(trone.x, trone.y, 15, 0, Math.PI * 2);
                ctx.fillStyle = trone.color;
                ctx.fill();

                // Remove megaTrons that have reached the bottom of the screen
                return trone.y < canvas.height;
            });
        }

        // Function to check bullet hits on megaTrons
        function checkHit() {
            bullets.forEach(bullet => {
                megaTrons.forEach(trone => {
                    if (bullet.x >= trone.x - 15 && bullet.x <= trone.x + 15 &&
                        bullet.y >= trone.y - 15 && bullet.y <= trone.y + 15) {
                        bullets = bullets.filter(b => b !== bullet);  // Remove bullet
                        trone.hits++;  // Increment hit count for megaTron

                        if (trone.hits >= 15) {
                            megaTrons = megaTrons.filter(t => t !== trone);  // Remove megaTron if hit count reaches 15
                            score += 1
                            showScore()
                            setHighScore()
                            showHighScore()
                        } else {
                            trone.color = randomColor();  // Change megaTron color to a new random color
                        }
                    }
                });
            });
        }

        function showScore(){
            document.querySelector('.score').innerHTML = `<p>Score: ${score}<p>`
        }        

        function showHighScore(){
            document.querySelector('.highScore').innerHTML= `<p>High Score: ${highScore}</p>`
        }

        function setHighScore(){
            if(score>highScore){
                highScore = score
                localStorage.setItem('hScore',highScore)
                console.log(highScore)
            }
        }

        // Function to generate a random RGB color
        function randomColor() {
            return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }

        function isHit(planeX, planeY, megaTrons) {
            for (let i = 0; i < megaTrons.length; i++) {
                // Assuming megaTrons[i] is an array representing [objectX, objectY]
                if (megaTrons[i][0] === planeX && megaTrons[i][1] === planeY) {
                    lifeLines -= 1;
                    console.log("Collision detected!");
                    // Optionally, break the loop if you want to handle only one collision per call
                    // break;
                }
            }
        }


        // Event listeners for key presses
        let moveLeft = false;
        let moveRight = false;
        let shooting = false;

        document.querySelector('.moveLeft').addEventListener('mousedown',()=>{
            moveLeft = true
        })

        document.querySelector('.moveLeft').addEventListener('mouseup',()=>{
            moveLeft = false
        })

        document.querySelector('.moveRight').addEventListener('mousedown',()=>{
            moveRight = true
        })

        document.querySelector('.moveRight').addEventListener('mouseup',()=>{
            moveRight = false
        })

        document.querySelector('.shoot').addEventListener('mousedown',()=>{
            shooting = true
        })

        document.querySelector('.shoot').addEventListener('mouseup',()=>{
            shooting = false
        })



        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                moveLeft = true;
            } else if (event.key === 'ArrowRight') {
                moveRight = true;
            }else if (event.code === 'Space' || event.key === ' '){
                shooting = true;
                event.preventDefault()
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === 'ArrowLeft') {
                moveLeft = false;
            } else if (event.key === 'ArrowRight') {
                moveRight = false;
            }else if (event.code ==='Space' || event.key === ' '){
                shooting = false;
                event.preventDefault()
            }
        });

        setInterval(()=>{
            spawnMegaTrons()
        },1000)

        // Main game loop
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

            // Update plane position based on key presses
            if (moveLeft && planeX > 0) {
                planeX -= planeSpeed;
            }
            if (moveRight && planeX < canvas.width - planeSize) {
                planeX += planeSpeed;
            }
            if (shooting){
                shoot(planeX,planeY)
            }

            // Draw plane
            ctx.beginPath();
            ctx.moveTo(planeX, planeY);
            ctx.lineTo(planeX + planeSize, planeY);
            ctx.lineTo(planeX + planeSize / 2, planeY - planeSize);
            ctx.closePath();
            ctx.fillStyle = planeColor;
            ctx.fill();

            

            // Handle shooting (not implemented in this example)
            // Move and draw bullets
            moveBullets();

            // Spawn megaTrons periodically (not implemented in this example) 
            // Move and draw megaTrons
            moveMegaTrons();

            // Check for bullet hits on megaTrons
            checkHit();

            requestAnimationFrame(gameLoop);  // Loop the game loop
        }

        // Start the game loop
        gameLoop();
    }