document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    const gameover = document.createElement('div')
    const scoreDiv = document.querySelector('.score')
    const platforms = []
    const dirs = ["left", "up", "down", "right", "still"]
    let startPoint = 200
    let maxJump = 200;
    let maxPlatformSpeed = 5;
    let doodlerBottomSpace = startPoint
    let doodlerLeftSpace = 0;
    let startJump = 0;
    let fallId
    let jumpId
    let score = 0
    let isGameOver = false;
    const maxWidth = document.body.offsetWidth || 1000
    const maxHeight = document.body.offsetHeight || 800
    const platformCount = Math.floor( maxWidth / 50) || 10

    class Platform {
        constructor(newPlatBottom) {
          this.left = Math.random() * maxWidth - 80
          this.bottom = Math.random() * maxHeight
          this.moving = dirs[Math.floor(Math.random() * dirs.length)]
          this.scored = false
          this.speed = Math.random() * maxPlatformSpeed;
          this.visual = document.createElement('div')
          const visual = this.visual
          visual.classList.add('platform')
          visual.style.left = this.left + 'px'
          visual.style.bottom = this.bottom + 'px'
          grid.appendChild(visual)
        }
      }

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerBottomSpace = maxHeight/2;
        doodlerLeftSpace = maxWidth/2
        moveDoodler(0, 0)
        fall()
    }

    function moveDoodler( x, y ){

        doodlerBottomSpace += y;
        doodlerLeftSpace += x;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        doodler.style.left = doodlerLeftSpace + 'px';
    }


    function createPlatforms() {
        for(let i = 0; i < platformCount; i++) {
          let platGap = maxHeight / platformCount
          let newPlatBottom = 100 + i * platGap
          let newPlatform = new Platform(newPlatBottom)
          platforms.push(newPlatform)
        }
    }

    function jump() {
        clearInterval(fallId)
        startJump = doodlerBottomSpace;
        jumpId = setInterval( function () {
            moveDoodler(0, 2)
            if(doodlerBottomSpace > startJump + maxJump){
                fall();
            }

        }, 10)
    }

    function fall() {
        clearInterval(jumpId)
        clearInterval(fallId)
        fallId = setInterval( function() {
            moveDoodler(0, -2);
            for(let platform of platforms) {
                if( doodlerBottomSpace >= platform.bottom &&
                    doodlerBottomSpace <= platform.bottom + 15 &&
                    doodlerLeftSpace + 60 > platform.left &&
                    doodlerLeftSpace < platform.left + 85 ){
                    if(!platform.scored){
                        if(!isGameOver) scoreDiv.innerHTML = ++score;
                        platform.scored = true;
                        platform.visual.classList.add('platform-scored')
                    }
                    jump()
                    break;
                }
                if( doodlerBottomSpace == 0 ){
                    gameOver();
                }
            }

        }, 10)
    }

    function movePlatforms(){
        platId = setInterval( function() {
            for(let platform of platforms) {
                if(platform.moving == "up"){
                    movePlatform(platform, 0, platform.speed);
                    if(platform.bottom > maxHeight - 15) platform.moving = "down"
                }
                else if(platform.moving == "down"){
                    movePlatform(platform, 0, -platform.speed);
                    if(platform.bottom < 0) platform.moving = "up"
                }
                else if(platform.moving == "left"){
                    movePlatform(platform, -platform.speed, 0);
                    if(platform.left < 0) platform.moving = "right"
                }
                else if(platform.moving == "right"){
                    movePlatform(platform, platform.speed, 0);
                    if(platform.left > maxWidth - 80) platform.moving = "left"
                }
            }

        }, 50)
    }

    function movePlatform(platform, x, y){

        platform.bottom += y;
        platform.left += x;
        platform.visual.style.left = platform.left + 'px'
        platform.visual.style.bottom = platform.bottom + 'px'
    }

    function control(e) {
        if(isGameOver){
            if(e.key === ' ') {
                restart()
            }
        }
        else {
            if(e.key === 'ArrowLeft') {
                moveDoodler(-10, 0);
            } else if (e.key === 'ArrowRight') {
                moveDoodler(10, 0);
            }
        }
    }

    function gameOver(){

        isGameOver = true;
        clearInterval(fallId);
        clearInterval(jumpId);
        doodler.classList.remove('doodler')
        gameover.classList.add('gameover')
        grid.appendChild(gameover)
    }

    function restart() {

        createDoodler()
        score = 0;
        isGameOver = false;
        gameover.classList.remove('gameover')
        platforms.forEach(platform => {
            platform.scored = false;
            platform.visual.classList.remove('platform-scored')
        })
    }

    function start() {
        createPlatforms()
        createDoodler()
        movePlatforms()
        document.addEventListener('keydown', control)
    }
    start()
});