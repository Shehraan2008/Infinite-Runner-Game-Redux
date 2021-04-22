var gameState = "play";
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;
var score;

function preload() {
  trex_running = loadAnimation(
    "images/trex1.png",
    "images/trex3.png",
    "images/trex4.png"
  );
  trex_collided = loadAnimation("images/trex_collided.png");
  groundImage = loadImage("images/ground2.png");
  cloudImage = loadImage("images/cloud.png");
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  restartImg = loadImage("images/restart.png");
  gameOverImg = loadImage("images/gameOver.png");
  jumpSound = loadSound("audio/jump.mp3");
  dieSound = loadSound("audio/die.mp3");
  checkPointSound = loadSound("audio/checkPoint.mp3");
}

function setup() {
  const canvas = createCanvas(800, 400);
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  ground = createSprite(20, 250, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  gameOver = createSprite(70, 90);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(70, 120);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  invisibleGround = createSprite(200, 250, 400, 10);
  invisibleGround.visible = false;
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
  // trex.debug = true
  score = 0;
}

function draw() {
  // background(rgb(160, 75, 230));
  background(255);
  textFont("VT323");
  textSize(20);
  text("Score: " + score, 300, 100);
  camera.position.x = trex.x;
  camera.position.y = trex.y;
  if (gameState === "play") {
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -(4 + (3 * score) / 100);
    score = score + Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }
    if (ground.x < 0) {
      ground.x = ground.width / 3;
    }
    if (keyDown("space") && trex.y >= 200) {
      trex.velocityY = -12;
      jumpSound.play();
    }
    trex.velocityY = trex.velocityY + 0.8;
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      jumpSound.play();
      gameState = "end";
      dieSound.play();
    }
  } else if (gameState === "end") {
    gameOver.visible = true;
    restart.visible = true;
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    if (mousePressedOver(restart)) {
      reset();
    }
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 230, 10, 40);
    obstacle.velocityX = -(6 + score / 100);
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 200;
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = "play";
  gameOver.visible = false;
  restart.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}
