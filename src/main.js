/*

Name: Wang Liao
Mod Title: Rocket Patrol With Mod
Approximate time: 12 hours

Mod List:
1. 5 Points
    - Track a high score that persists across scenes and display it in the UI
    - Implement the 'FIRE' UI text from the original game
        - For this mod, I put the "FIRE" text slightly under the "Score" text becuase the top screen space has been occupied by other UIs
    - Implement the speed increase that happens after 30 seconds in the original game
    - Create a new scrolling tile sprite for the background
    - Allow the player to control the Rocket after it's fired
2. (10 Points)
    - Create 4 new explosion sound effects and randomize which one plays on impact
    - Display the time remaining (in seconds) on the screen
    - Create a new title screen (e.g., new artwork, typography, layout)
3. (15 Points)
    - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
    - Implement a new timing/scoring mechanism that adds time to the clock for successful hits
    - Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship

*/

let config = 
{
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

//store high score
let highScoreRecord = 0;