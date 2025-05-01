import TileMap from './vægge.js'
//her konstantere jeg, hvilket størrelse hver flise skal havde og hvor hurtigt de forskellige ting skal bevæge sig.
const tileSize = 60
const velocity = 2.5

//her henter jeg canvas-elementer fra HTML og opretter spillet i 2D.
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

//her opretter jeg instanser af tileMap, pac-man og spøgelserne ved at hente tingene fra tileMap.
const tileMap = new TileMap(tileSize)
const pacman = tileMap.getPacman(velocity)
const ghosts = tileMap.getGhost(velocity)

let gameOver = false
let gameWin = false

// her laver jeg det loop, som gør spillet kører med et givet interval og tegner de forskellige ting som banen, game over eller game win, pac-man, spøgelser og tjekker om spillet er slut.
function gameLoop () {
  tileMap.draw(ctx)
  drawGameEnd()
  pacman.draw(ctx, pause(), ghosts)
  ghosts.forEach(ghost => ghost.draw(ctx, pause(), pacman))
  ctx.font = '50px serif'
  ctx.fillStyle = 'red'
  ctx.fillText(pacman.life, 20, 50)
  checkGameOver()
  checkGameWin()
}

//Her laver jeg et gameLoop for spillet primære ting så de bliver opdatere, gælder både banen, pac-man, spøgelserne, spillet er slut og checker at spillet er slut.
function checkGameWin () {
  if (!gameWin) {
    gameWin = tileMap.didWin()
  }
}

//her opdaterer jeg om spillet er slut.
function checkGameOver () {
  if (!gameOver) {
    gameOver = isGameOver() && pacman.life < 1
  }
}

// tjekker om spillet er over og om et spøgelse har ramt pac-man er blevet ramt af et spøgelse, hvor pac-man ikke har en powerdot aktiveret
function isGameOver () {
  return ghosts.some(ghost => {
    if (ghost.collideWith(pacman)) {
      if (pacman.powerDotActive) {
        ghost.active = false
        return false
      } else {
        pacman.life--
        ghost.active = false
        return true
      }
    } else {
      false
    }
  })
}

// venter til pac-man har taget første bevægelse.
function pause () {
  return !pacman.madeFirstMove || gameOver || gameWin
}
// tegner det som der skal ske når spillet er slut, hvor man enten har vundet eller tabt.
function drawGameEnd () {
  if (gameOver || gameWin) {
    let text = ' You Win!'
    if (gameOver) {
      text = 'Game Over!'
    }

    ctx.font = '300px lato'
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop('0', 'yellow')
    gradient.addColorStop('0.5', 'orange')
    gradient.addColorStop('1.0', 'red')

    ctx.fillStyle = gradient
    ctx.fillText(text, 50, canvas.height/2)
  }
}


tileMap.setCanvasSize(canvas)
setInterval(gameLoop, 1000 / 80)