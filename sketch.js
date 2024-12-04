// let ball;

// function setup() {
// 	new Canvas(500, 500);
// 	displayMode('centered');

// 	ball = new Sprite();
// 	ball.diameter = 50;
// }

// function draw() {
// 	background('skyblue');

// 	if (mouse.presses()) {
// 		ball.speed = 10;
// 		ball.moveTo(mouse);
// 	}
// }

// let ball;

// function setup() {
//   new Canvas(500, 500); // Create a centered canvas
//   displayMode('centered');

//   ball = new Sprite(); // Initialize the ball
//   ball.diameter = 50;  // Set the ball's size
//   ball.bounciness = 1; // Make the ball bounce off edges
// }

// function draw() {
//   background('skyblue'); // Set a background color

//   // Check if the mouse is pressed
//   if (mouse.presses()) {
//     ball.speed += 1; // Increase speed with each click
//     ball.moveTo(mouse); // Move the ball toward the mouse
//   }

//   // Display the current speed
//   textSize(20);
//   fill('black');
//   text(`Speed: ${ball.speed.toFixed(2)}`, 10, 30);
// }


let ball; // The player's ball
let obstacles = []; // Array to store falling obstacles
let score = 0; // Player's score
let gameOver = false; // Game state
let spawnRate = 60; // Frames between obstacle spawns
let obstacleSpeed = 3; // Initial obstacle speed

function setup() {
  new Canvas(500, 500); // Create a canvas
  displayMode('centered');
  initializeGame(); // Initialize the game elements
}

function draw() {
  background('skyblue'); // Set a background color

  if (!gameOver) {
    // Move the ball to the mouse position faster
    if (mouse.presses()) {
      ball.speed = 8; // Make the ball move faster
      ball.moveTo(mouse);
    }

    // Create obstacles at dynamic intervals
    if (frameCount % spawnRate === 0) {
      spawnObstacles(); // Call function to spawn obstacles
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (obstacles[i].y > 500) {
        obstacles[i].remove(); // Remove obstacles that go off-screen
        obstacles.splice(i, 1);
        score++; // Increase score for avoiding an obstacle

        // Gradually increase difficulty
        if (score % 5 === 0) {
          spawnRate = max(20, spawnRate - 5); // Decrease spawn interval (min 20)
          obstacleSpeed += 0.5; // Increase obstacle speed
        }
      } else if (obstacles[i].collides(ball)) {
        gameOver = true; // End the game if the ball hits an obstacle
      }
    }

    // Display the score
    drawScore();
  } else {
    // Game over screen
    textSize(30);
    fill('red');
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 20);
    text(`Final Score: ${score}`, width / 2, height / 2 + 20);
    text("Press R to Restart", width / 2, height / 2 + 60);

    // Restart the game if 'R' is pressed
    if (keyIsDown(82)) { // 82 is the key code for 'R'
      initializeGame(); // Reset the game entirely
    }
  }
}

// Function to spawn obstacles with varied intervals and occasional simultaneous drops
function spawnObstacles() {
  let numObstacles = random() < 0.3 ? 2 : 1; // 30% chance to drop 2 obstacles at once
  for (let i = 0; i < numObstacles; i++) {
    let obstacle = new Sprite(random(50, 450), 0, 50, 50); // Random x, y=0
    obstacle.color = 'red';
    obstacle.speed = obstacleSpeed; // Dynamic falling speed
    obstacle.direction = 90; // Make the obstacle fall down
    obstacles.push(obstacle); // Add obstacle to array
  }
}

// Draw the score at the top-left corner
function drawScore() {
  textSize(20);
  fill('black');
  textAlign(LEFT, TOP); // Ensure text stays at top-left
  text(`Score: ${score}`, 10, 10);
}

function initializeGame() {
  // Reset the game state
  score = 0;
  gameOver = false;
  spawnRate = 60; // Reset spawn rate
  obstacleSpeed = 3; // Reset obstacle speed

  // Reset the player
  if (ball) {
    ball.remove(); // Remove the previous ball instance
  }
  ball = new Sprite();
  ball.diameter = 50;
  ball.x = width / 2; // Start at the center
  ball.y = height - 100; // Near the bottom

  // Clear all obstacles
  for (let obstacle of obstacles) {
    obstacle.remove(); // Remove each obstacle instance
  }
  obstacles = []; // Clear the obstacles array
}
