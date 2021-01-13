var mario, wall, castleWall, logo, startButton, gameOver, replayButton;
var marioStanding, marioJumping;
var wallImage, logoImage, startImage, castleWallImage, windowImage, brickImage, spikeImage, gameOverImage, replayImage, ladderImage, pipeImage, bulletImage;
var jumpSound, endSound;
var windowGroup, brickGroup, obstacleGroup, ladderGroup;
var gameState = "Start";
var r;

function preload() {
  marioStanding = loadImage("mario-standing.png");
  marioJumping = loadImage("mario-jumping.png");
  wallImage = loadImage("wall-sprite.png");
  logoImage = loadImage("game-logo.png");
  startImage = loadImage("start.png");
  castleWallImage = loadImage("castle-wall.png");
  windowImage = loadImage("window.png");
  brickImage = loadImage("window-brick.png");
  spikeImage = loadImage("spike.png");
  gameOverImage = loadImage("gameover.png");
  replayImage = loadImage("replay.png");
  ladderImage = loadImage("ladder.png");
  pipeImage = loadImage("pipe.png");
  bulletImage = loadImage("bullet.png");
  
  jumpSound = loadSound("mario-jump.mp3");
  endSound = loadSound("mario-death.mp3");
}

function setup() {
  createCanvas(600, 600);

  mario = createSprite(300, 550, 50, 50);
  mario.addImage(marioStanding);
  mario.scale = 0.07;
  mario.setCollider("rectangle", 0, 0, 1000, 1000);

  wall = createSprite(300, 200, 600, 600);
  wall.addImage(wallImage);
  wall.depth = mario.depth - 1;
  wall.scale = 0.5;

  castleWall = createSprite(300, 300, 600, 600);
  castleWall.addImage(castleWallImage);
  castleWall.depth = mario.depth - 1;
  castleWall.scale = 1.85;

  logo = createSprite(300, 200, 100, 100);
  logo.addImage(logoImage);
  logo.scale = 0.5;

  startButton = createSprite(300, 360, 50, 50);
  startButton.addImage(startImage);
  startButton.scale = 0.5;

  gameOver = createSprite(300, 200, 100, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.6;
  gameOver.visible = false;

  replayButton = createSprite(300, 500, 100, 100);
  replayButton.addImage(replayImage);
  replayButton.scale = 0.4;
  replayButton.visible = false;

  windowGroup = createGroup();
  brickGroup = createGroup();
  obstacleGroup = createGroup();
  ladderGroup = createGroup();
}

function draw() {
  background("white");
  if (gameState === "Start") {
    wall.visible = false;
    startButton.visible = true;
    logo.visible = true;

    if (mousePressedOver(startButton)) {
      gameState = "Play";
      startButton.visible = false;
      mario.y = 300;
      
      var platform = createSprite(mario.x, mario.y + 50,50,50);
      platform.addImage(brickImage);
      platform.scale = 0.6;
      platform.lifetime = 100;
      brickGroup.add(platform);
    }

  } else if (gameState === "Play") {
    logo.visible = false;
    castleWall.visible = false;

    mario.visible = true;
    wall.visible = true;
    windowGroup.setVisibleEach(true);
    brickGroup.setVisibleEach(true);
    obstacleGroup.setVisibleEach(true);

    //allow mario to jump using space bar
    if (keyWentDown("space")) {
      mario.addImage(marioJumping);
      mario.velocityY = -15;
      jumpSound.play();
      mario.scale = 0.21;
      mario.setCollider("rectangle", 0, 0, 300, 300);
    }
    if (keyWentUp("space")) {
      mario.addImage(marioStanding);
      mario.scale = 0.07;
      mario.setCollider("rectangle", 0, 0, 1000, 1000);
    }

    //allow mario to move left and right using arrow keys
    if (keyDown("left")) {
      mario.x = mario.x - 5;
    }
    if (keyDown("right")) {
      mario.x = mario.x + 5;
    }

    //add gravity
    mario.velocityY = mario.velocityY + 0.5;

    //make a scrolling wall
    wall.velocityY = 3;

    if (wall.y > 490) {
      wall.y = 300;
    }

    if (mario.isTouching(brickGroup)) {
      mario.velocityY = 0;
    }
    if (mario.isTouching(obstacleGroup) || mario.y > 650) {
      gameState = "End";
      endSound.play();
    }
    if (mario.isTouching(ladderGroup)) {
      mario.velocityY = -1;
    }
    
    //create a random variable which will be used for random spawning
    r = Math.round(random(1, 2));
    
    //call the functions
    spawnWindows();
    spawnObstacles();

  } else if (gameState === "End") {
    mario.visible = false;
    wall.visible = false;
    windowGroup.destroyEach();
    brickGroup.destroyEach();
    obstacleGroup.destroyEach();
    ladderGroup.destroyEach();

    gameOver.visible = true;
    replayButton.visible = true;

    if (mousePressedOver(replayButton)) {
      restart();
      replayButton.visible = false;
      gameOver.visible = false;
    }
  }

  drawSprites();
}

function spawnWindows() {

  if (frameCount % 100 === 0) {
    var window = createSprite(Math.round(random(70, 530)), -50, 50, 50);
    window.addImage(windowImage);
    window.velocityY = 3;
    window.scale = 0.5;
    window.depth = mario.depth - 1;
    window.lifetime = 200;
    windowGroup.add(window);

    var brick = createSprite(window.x, window.y + 80, 50, 50);
    brick.addImage(brickImage);
    brick.velocityY = 3;
    brick.scale = 0.6;
    brick.depth = mario.depth - 1;
    brick.lifetime = 200;
    brickGroup.add(brick);

    if (r === 1) {
      var spike = createSprite(window.x, brick.y + 30, 50, 50);
      spike.addImage(spikeImage);
      spike.velocityY = 3;
      spike.scale = 0.12;
      spike.lifetime = 200;
      obstacleGroup.add(spike);
    } else if (r === 2) {
      var ladder = createSprite(window.x, brick.y + 50, 50, 50);
      ladder.addImage(ladderImage);
      ladder.velocityY = 3;
      ladder.scale = 0.35;
      ladder.lifetime = 200;
      ladderGroup.add(ladder);
    }
  }
}

function spawnObstacles() {
  if (frameCount % 420 === 0){
    var pipe = createSprite(0, 0, 300, 300);
    pipe.addImage(pipeImage);
    pipe.velocityY = 3;
    pipe.scale = 0.4;
    pipe.lifetime = 200;
    obstacleGroup.add(pipe);

    var bullet = createSprite(pipe.x, pipe.y, 300, 300);
    bullet.addImage(bulletImage);
    bullet.scale = 0.1;
    bullet.depth = pipe.depth - 1;
    bullet.velocityY = 3;
    bullet.lifetime = 200;
    obstacleGroup.add(bullet);

    if (r === 1) {
      pipe.x = 40;
      pipe.rotation = 90;
      bullet.x = 50;
      bullet.rotation = 0;
      bullet.velocityX = 5;
    } else if (r === 2) {
      pipe.x = 560;
      pipe.rotation = -90;
      bullet.x = 550;
      bullet.rotation = -180;
      bullet.velocityX = -5;
    }
  }
}

function restart() {
  gameState = "Start";
  
  mario.x = 300;
  mario.y = 300;
  mario.velocityY = 0;
  
  wall.visible = false;
  startButton.visible = true;
  castleWall.visible = true;
  logo.visible = true;
}