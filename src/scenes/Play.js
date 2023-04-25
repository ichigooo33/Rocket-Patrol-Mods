class Play extends Phaser.Scene
{
    constructor()
    {
        super("playScene");
    }

    preload()
    {
        //load images/title sprites
        this.load.image("rocket", "./assets/rocket.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("starfield", "./assets/starfield.png");

        //load spritesheet
        this.load.spritesheet("explosion", "./assets/explosionSpriteSheet.png", {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create()
    {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0, 0);

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, "rocket").setOrigin(0.5, 0);

        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, "spaceship", 0, 30, 2000).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, "spaceship", 0, 20, 1000).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, "spaceship", 0, 10, 500).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 8, first: 0}),
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;

        //initialize timer
        this.initialTimer = game.settings.gameTimer;

        //display score
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        //display timer
        let timerConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timeLeft = this.add.text(game.config.width - borderUISize - borderPadding - timerConfig.fixedWidth, borderUISize + borderPadding * 2, this.initialTimer, timerConfig);

        //GAME OVER flag
        this.gameOver = false;

        //gameOver text
        this.gameOverText_1 = this.add.text(game.config.width / 2, game.config.height / 2, "GAME OVER", scoreConfig).setOrigin(0.5);
        this.gameOverText_2 = this.add.text(game.config.width / 2, game.config.height / 2 + 64, "Press (R) to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
        this.gameOverText_1.alpha = 0;
        this.gameOverText_2.alpha = 0;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.addTimeEvent(game.settings.gameTimer);
    }

    update()
    {
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT))
        {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -=2;       //update the background

        if(!this.gameOver)
        {
            this.p1Rocket.update();                 //update player 1 rocket

            this.ship01.update();                   //update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }

        //check collisions (rocket & spaceship)
        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            console.log("kaboom ship 01!");
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            console.log("kaboom ship 02!");
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            console.log("kaboom ship 03!");
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        //update remaining time
        this.updateTimer();
    }

    checkCollision(rocket, ship)
    {
        //simple AABB checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.y + rocket.height > ship.y)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    shipExplode(ship)
    {
        //temporarily hide ship
        ship.alpha = 0;

        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.anims.play("explode");                 //play explode animation
        boom.on("animationcomplete", () => {        //callback after anim completes
            ship.reset();                           //reset ship position
            ship.alpha = 1;                         //make ship visible again
            boom.destroy();                         //remove explosion sprite
        });

        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        //extra time add and repaint
        let tempTimer = this.timedEvent.getRemaining() + ship.timePoints;
        this.addTimeEvent(tempTimer);
        this.updateTimer();

        this.sound.play("sfx_explosion");
    }

    updateTimer()
    {
        let tempTime = Math.floor(this.timedEvent.getRemainingSeconds());

        if(tempTime == 0)
        {
            this.gameOver = true;
            this.gameOverText_1.alpha = 1;
            this.gameOverText_2.alpha = 1;
        }

        if(tempTime != this.timeLeft.text)
        {
            this.timeLeft.text = tempTime;
        }
    }

    addTimeEvent(delayTime)
    {
        this.timedEvent = new Phaser.Time.TimerEvent({delay: delayTime});
        this.time.addEvent(this.timedEvent);
    }
}