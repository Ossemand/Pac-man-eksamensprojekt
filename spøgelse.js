import MovingDirection from './bevægelsesretning.js'


 // her constructoren for spøgelserne, som indeholder deres x og y samt, deres størrelse i tileSize og deres bevægelse hastighed og om de rammer vægge og holder sig inden for tileMap. Her kalder jeg også de billeder der skal bruges til spøgelse, samt hvilken retning, som er tilfældig, som de starter med. Her intialiserer jeg også, hvor ofte de skal prøve at ændre retning. Her laver jeg også det, som gør at spøgelser flasher når tiden med powerdot er aktivt begynder at blinke.
export default class Ghosts {
  constructor (x, y, tileSize, velocity, tileMap) {
    this.x = x
    this.y = y
    this.tileSize = tileSize
    this.velocity = velocity
    this.tileMap = tileMap
    this.active = true

    this.loadImages()

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    )

    this.directionTimerDefault = this.random(5, 15)
    this.directionTimer = this.directionTimerDefault

    this.scaredAboutToExpireTimerDefault = 10
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault
  }
 
 // her tegnes spøgelse og tjekker om spillet er igang ved pause og hvis det er igang skal de move og ændre retning.
  draw (ctx, pause, pacman) {
    if (this.active == false) {
      return
    }
    if (!pause) {
      this.move()
      this.changeDirection()
    }
    this.setImage(ctx, pacman)
  }
 
// her tjekker jeg om et spøgelse kolliderer med et spøgelse.
  collideWith (pacman) {
    if (this.active == false) {
      return false
    }
    const size = this.tileSize / 2
    if (
      this.x < pacman.x + size &&
      this.x + size > pacman.x &&
      this.y < pacman.y + size &&
      this.y + size > pacman.y
    ) {
      return true
    } else {
      return false
    }
  }
  
   // sætter billedet til normalt spøgelse, hvis der ikke er en powerdot aktivt
  setImage (ctx, pacman) {
    if (pacman.powerDotActive) {
      this.setImageWhenPowerDotIsActive(pacman)
    } else {
      this.image = this.normalGhost
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize)
  }
 
  //ændre billedet til skræmt spøgelse, hvis powerdot og ændre mellem de to billeder når der ikke er meget tid tilbage på powerdotten.
  setImageWhenPowerDotIsActive (pacman) {
    if (pacman.powerDotAboutToExpire) {
      this.scaredAboutToExpireTimer--
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault
        if (this.image === this.scaredGhost) {
          this.image = this.scaredGhost2
        } else {
          this.image = this.scaredGhost
        }
      }
    } else {
      this.image = this.scaredGhost
    }
  }

// Her styres, hvornår spøgelset skal forsøge at ændre retning og tjekker om man vil ramme en væg ved det og hvis ikke så ændre den retning
  changeDirection () {
    this.directionTimer--
    let newMoveDirection = null
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      )
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection
        }
      }
    }
  }
  
// Her opdateres dens x og y position alt efter, hvilket velocity og retning det specifikke spøgelse bevæger sig i
  move () {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity
          break
        case MovingDirection.down:
          this.y += this.velocity
          break
        case MovingDirection.left:
          this.x -= this.velocity
          break
        case MovingDirection.right:
          this.x += this.velocity
          break
      }
    }
  }
  
    // Hjælper til med at vælge et heltal og bestemmer retningen den skal ændres til at gå i.
  random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

// tegner de forskellige billeder og vælger, hvilket eder er normalt spøgelse.
  loadImages () {
    this.normalGhost = new Image()
    this.normalGhost.src = 'images/ghost.png'

    this.scaredGhost = new Image()
    this.scaredGhost.src = 'images/scaredGhost.png'

    this.scaredGhost2 = new Image()
    this.scaredGhost2.src = 'images/scaredGhost2.png'

    this.image = this.normalGhost
  }
}
