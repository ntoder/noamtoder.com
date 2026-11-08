// games.js — the list of every game on the hub (no Firebase needed, so the homepage always works)
// ---------- Every game on the hub ----------
// id = game folder name in lowercase. To add a game: add a line here — the homepage,
// profile and admin page all read this list.
export const GAMES = {
    noametry:     { name: "Noametry",      path: "/Noametry/noametry",         img: "/Noametry.png",           tags: ["puzzle"],           desc: "Jump and dodge your way through geometric levels.", original: true },
    spaceshooter: { name: "Space Shooter", path: "/SpaceShooter/spaceshooter", img: "/thumbs/spaceshooter.png", tags: ["arcade"],           desc: "Blast alien waves, grab power-ups, beat the boss." },
    game2048:     { name: "2048",          path: "/Game2048/2048",             img: "/thumbs/2048.png",         tags: ["puzzle"],           desc: "Slide and merge the tiles to reach 2048." },
    breakout:     { name: "Brick Smash",      path: "/Breakout/breakout",         img: "/thumbs/breakout.png",     tags: ["arcade"],           desc: "Smash every brick — level after level." },
    memory:       { name: "Memory Match",  path: "/Memory/memory",             img: "/thumbs/memory.png",       tags: ["puzzle"],           desc: "Flip cards and find every pair." },
    subwaysurfer: { name: "Subway Runner", path: "/SubwaySurfer/subwaysurf",   img: "/thumbs/subway.png",       tags: ["runner"],           desc: "Switch lanes, jump barriers, dodge the trains." },
    dinogame:     { name: "Dino Run",      path: "/DinoGame/dinogame",         img: "/thumbs/dino.png",         tags: ["runner", "arcade"], desc: "Jump the cacti and duck under the birds." },
    flappybird:   { name: "Sky Hopper",    path: "/FlappyBird/flappybird",     img: "/thumbs/flappybird.png",  tags: ["arcade"],           desc: "Tap to flap and fly through the gaps." },
    snake:        { name: "Snake",         path: "/Snake/snake",               img: "/thumbs/snake.png",              tags: ["arcade"],           desc: "The classic — eat and grow longer." },
    pacman:       { name: "Maze Muncher",        path: "/Pacman/pacman",             img: "/thumbs/pacman.png",             tags: ["arcade"],           desc: "Eat all the dots and avoid the ghosts." },
    tetris:       { name: "Block Drop",        path: "/Tetris/tetris",             img: "/thumbs/tetris.png",             tags: ["puzzle"],           desc: "Arrange falling blocks to clear lines." },
    mario:        { name: "Pixel Jumper",         path: "/Mario/mario",               img: "/thumbs/mario.png",              tags: ["platformer"],       desc: "Run, jump and stomp across new levels." },
    bubblebobble: { name: "Bubble Blaster", path: "/BubbleBobble/bubblebobble", img: "/thumbs/bubblebobble.png",       tags: ["arcade", "platformer"], desc: "Blow bubbles to trap the monsters." },
    chess:        { name: "Chess",         path: "/Chess/chess",               img: "/thumbs/chess.png",              tags: ["puzzle", "brain"],           desc: "Play chess against the computer or a friend." },
    motorracing:  { name: "Motor Racing",  path: "/MotorRacing/motorracing",   img: "/thumbs/motorracing.png",        tags: ["sports"],           desc: "Race and dodge the traffic." },
    soccer:       { name: "Soccer",        path: "/Soccer/soccer",             img: "/thumbs/soccer.png",             tags: ["sports"],           desc: "Score more goals than the computer in 90 seconds." },
    paddlebattle: { name: "Paddle Battle", path: "/PaddleBattle/paddlebattle", img: "/thumbs/paddlebattle.png", tags: ["arcade", "sports"], desc: "Bounce the ball past the computer. First to 7 wins." },
    fourinarow:   { name: "Four in a Row", path: "/FourInARow/fourinarow",     img: "/thumbs/fourinarow.png",   tags: ["puzzle", "brain"],  desc: "Drop discs and line up four before the computer." },
    tictactoe:    { name: "Tic-Tac-Toe",   path: "/TicTacToe/tictactoe",       img: "/thumbs/tictactoe.png",    tags: ["puzzle", "brain"],  desc: "X and O against the computer or a friend." },
    minefinder:   { name: "Mine Finder",   path: "/MineFinder/minefinder",     img: "/thumbs/minefinder.png",   tags: ["puzzle", "brain"],  desc: "Use the numbers to find every hidden mine." },
    molemash:     { name: "Mole Mash",     path: "/MoleMash/molemash",         img: "/thumbs/molemash.png",     tags: ["arcade"],           desc: "Bop the moles, skip the bombs, beat the clock." },
    colorecho:    { name: "Color Echo",    path: "/ColorEcho/colorecho",       img: "/thumbs/colorecho.png",    tags: ["puzzle", "brain"],  desc: "Remember the colour pattern and play it back." },
    stacktower:   { name: "Stack Tower",   path: "/StackTower/stacktower",     img: "/thumbs/stacktower.png",   tags: ["arcade"],           desc: "Drop the blocks and build the tallest tower." },
    spacerocks:   { name: "Space Rocks",   path: "/SpaceRocks/spacerocks",     img: "/thumbs/spacerocks.png",   tags: ["arcade"],           desc: "Fly, shoot and break the space rocks apart." },
    mathblitz:    { name: "Math Blitz",    path: "/MathBlitz/mathblitz",       img: "/thumbs/mathblitz.png",    tags: ["brain"],            desc: "Solve as many sums as you can in 60 seconds." },
    typingrain:   { name: "Typing Rain",   path: "/TypingRain/typingrain",     img: "/thumbs/typingrain.png",   tags: ["brain"],            desc: "Type the falling words before they land." },
    penalty:      { name: "Penalty Shootout", path: "/Penalty/penalty",        img: "/thumbs/penalty.png",      tags: ["sports"],           desc: "Shoot penalties, then dive to save them." },
    keepyuppy:    { name: "Keepy Uppy",    path: "/KeepyUppy/keepyuppy",       img: "/thumbs/keepyuppy.png",    tags: ["sports", "arcade"], desc: "Keep the football in the air as long as you can." },
    minigolf:     { name: "Mini Golf",     path: "/MiniGolf/minigolf",         img: "/thumbs/minigolf.png",     tags: ["sports"],           desc: "Nine holes of putting, walls, water and sand." },
    bowling:      { name: "Bowling",       path: "/Bowling/bowling",           img: "/thumbs/bowling.png",      tags: ["sports"],           desc: "Swipe to bowl, add spin and go for a strike." },
    tennis:       { name: "Tennis",        path: "/Tennis/tennis",             img: "/thumbs/tennis.png",       tags: ["sports"],           desc: "Rally against the computer and win the match." },
    airhockey:    { name: "Air Hockey",    path: "/AirHockey/airhockey",       img: "/thumbs/airhockey.png",    tags: ["sports", "arcade"], desc: "Smash the puck into the computer's goal." },
    hoopshot:     { name: "Hoop Shot",     path: "/HoopShot/hoopshot",         img: "/thumbs/hoopshot.png",     tags: ["sports"],           desc: "Shoot as many baskets as you can in 60 seconds." },
    gemswap:      { name: "Gem Swap",      path: "/GemSwap/gemswap",           img: "/thumbs/gemswap.png",      tags: ["puzzle"],           desc: "Swap gems to match three and set off chains." },
    skyclimber:   { name: "Sky Climber",   path: "/SkyClimber/skyclimber",     img: "/thumbs/skyclimber.png",   tags: ["arcade", "platformer"], desc: "Bounce up from cloud to cloud into space." },
    fruitslash:   { name: "Fruit Slash",   path: "/FruitSlash/fruitslash",     img: "/thumbs/fruitslash.png",   tags: ["arcade"],           desc: "Swipe to slice the fruit. Never the bombs!" },
    headerhero:   { name: "Header Hero",   path: "/HeaderHero/headerhero",     img: "/thumbs/headerhero.png",   tags: ["sports"],           desc: "Head the crosses into the goal past the keeper." },
    fiveaside:    { name: "5-a-Side",      path: "/FiveASide/fiveaside",       img: "/thumbs/fiveaside.png",    tags: ["sports"],           desc: "A full football match: pass, dribble and shoot." },
    checkers:     { name: "Checkers",      path: "/Checkers/checkers",         img: "/thumbs/checkers.png",     tags: ["puzzle", "brain"],  desc: "Jump and capture to beat the computer." },
    sudoku:       { name: "Sudoku",        path: "/Sudoku/sudoku",             img: "/thumbs/sudoku.png",       tags: ["puzzle", "brain"],  desc: "Fill the grid so every row, column and box has 1 to 9." },
    solitaire:    { name: "Solitaire",     path: "/Solitaire/solitaire",       img: "/thumbs/solitaire.png",    tags: ["puzzle"],           desc: "The classic card game. Build each suit from A to K." },
    seabattle:    { name: "Sea Battle",    path: "/SeaBattle/seabattle",       img: "/thumbs/seabattle.png",    tags: ["puzzle", "brain"],  desc: "Find and sink the computer's hidden fleet." },
    castledefense:{ name: "Castle Defense", path: "/CastleDefense/castledefense", img: "/thumbs/castledefense.png", tags: ["strategy", "brain"], desc: "Build towers and stop 20 waves of invaders.", isNew: true },
    wordguess:    { name: "Word Guess",    path: "/WordGuess/wordguess",       img: "/thumbs/wordguess.png",    tags: ["word", "brain"],    desc: "Find the secret 5-letter word in 6 tries.", isNew: true },
    wordsearch:   { name: "Word Search",   path: "/WordSearch/wordsearch",     img: "/thumbs/wordsearch.png",   tags: ["word", "puzzle"],   desc: "Find every hidden word in the letter grid.", isNew: true },
    flagquiz:     { name: "Flag Quiz",     path: "/FlagQuiz/flagquiz",         img: "/thumbs/flagquiz.png",     tags: ["brain"],            desc: "Countries, flags and capitals of the world.", isNew: true },
    rhythmtap:    { name: "Rhythm Tap",    path: "/RhythmTap/rhythmtap",       img: "/thumbs/rhythmtap.png",    tags: ["arcade"],           desc: "Hit the falling notes right on the beat.", isNew: true },
    idlebakery:   { name: "Idle Bakery",   path: "/IdleBakery/idlebakery",     img: "/thumbs/idlebakery.png",   tags: ["strategy"],         desc: "Bake cupcakes, hire helpers, grow your bakery.", isNew: true },
    pixelpaint:   { name: "Pixel Paint",   path: "/PixelPaint/pixelpaint",     img: "/thumbs/pixelpaint.png",   tags: ["creative"],         desc: "Draw pixel art and save your picture.", isNew: true },
    tankbattle:   { name: "Tank Battle",   path: "/TankBattle/tankbattle",     img: "/thumbs/tankbattle.png",   tags: ["arcade"],           desc: "Defend your base from waves of enemy tanks.", isNew: true },
    fishing:      { name: "Fishing Frenzy", path: "/Fishing/fishing",          img: "/thumbs/fishing.png",      tags: ["arcade"],           desc: "Cast your line and catch the rarest fish.", isNew: true },
    maze:         { name: "Maze Escape",   path: "/Maze/maze",                 img: "/thumbs/maze.png",         tags: ["puzzle", "brain"],  desc: "Find the exit of a brand new maze every time.", isNew: true }
};

// Games that only count plays (no score)
export const PLAY_ONLY = ["chess", "tictactoe", "pixelpaint"];

// Used until you save your own choice on the admin page (stored in Firestore: settings/games)
export const DEFAULT_PREMIUM = ["spaceshooter", "game2048", "mario", "bubblebobble", "chess", "spacerocks", "typingrain"];

