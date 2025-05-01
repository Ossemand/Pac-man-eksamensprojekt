import MovingDirection from './bevægelsesretning.js'

//her intialisere jeg pac-man med de ting den skal indeholde. Med ting som dens x og y retning tileSize og velocity og tileMa og de forskellige animationer og at spillet først skal starte når man vælger at sætte pac-man i gang med at bevæge sig.
export default class Pacman {
  constructor (x, y, tileSize, velocity, tileMap) {
    this.x = x
    this.y = y
    this.tileSize = tileSize
    this.velocity = velocity
    this.tileMap = tileMap

    this.currentMovingDirection = null
    this.requestedMovingDirection = null

    this.pacmanAnimationTimerDefault = 10
    this.pacmanAnimationTimer = null

    this.pacmanRotation = this.Rotation.right

    this.powerDotActive = false
    this.powerDotAboutToExpire = false
    this.timers = []

    this.madeFirstMove = false
    this.life = 2
    document.addEventListener('keydown', this.keydown)

    this.loadPacmanImages()
  }
  
    //kalder et objekt med de roteringersretninger der er.
  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3
  }

// her tegner jeg pac-man og tjekker om der er pause altså om spillet er igang, for, hvis ja skal ting bevæge sig og derfor køre move og animation. Her kalder jeg også de ting med at kunne spise de andre ting.
  draw (ctx, pause) {
    if (!pause) {
      this.move()
      this.animate()
    }
    this.eatDot()
    this.eatPowerDot()
    this.eatHeart()

    const size = this.tileSize / 2

    ctx.save()
    ctx.translate(this.x + size, this.y + size)
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180)
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    )

    ctx.restore()
  }
  
   // her indsætter jeg billederne af pac-man så han kan tegnes og gemmer dem i et array.
  loadPacmanImages () {
    const pacmanImage1 = new Image()
    pacmanImage1.src = 'Images/pacx.png'

    const pacmanImage2 = new Image()
    pacmanImage2.src = 'Images/pacy.png'

    const pacmanImage3 = new Image()
    pacmanImage3.src = 'Images/pacz.png'

    this.pacmanImages = [pacmanImage1, pacmanImage2, pacmanImage3]

    this.pacmanImageIndex = 0
  }
 
    // her bruger jeg movingdirection til at kunne ændre hvilken retning det er at pac-man kan bevæge sig i.
  keydown = event => {
    //op
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up
      this.requestedMovingDirection = MovingDirection.up
      this.madeFirstMove = true
    }
    //ned
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down
      this.requestedMovingDirection = MovingDirection.down
      this.madeFirstMove = true
    }
    //venstre
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left
      this.requestedMovingDirection = MovingDirection.left
      this.madeFirstMove = true
    }
    //højre
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right
      this.requestedMovingDirection = MovingDirection.right
      this.madeFirstMove = true
    }
  }

  //Her sker det så at den kan bevæge sig, hvis spillet er i gang og pac-man ikke går ind i en væg og kalder didCollideWithEnvironment. Her opdateres også rotationen så den rotere sig når den bevæger sig.
  move () {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.pacmanAnimationTimer = null
      this.pacmanImageIndex = 1
      return
    } else if (
      this.currentMovingDirection != null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity
        this.pacmanRotation = this.Rotation.up
        break
      case MovingDirection.down:
        this.y += this.velocity
        this.pacmanRotation = this.Rotation.down
        break
      case MovingDirection.left:
        this.x -= this.velocity
        this.pacmanRotation = this.Rotation.left
        break
      case MovingDirection.right:
        this.x += this.velocity
        this.pacmanRotation = this.Rotation.right
        break
    }
  }
  
   //her har jeg lavet animation ved at skifte mellem de forskellige billeder af pac-man så den åbner og lukker munden.
  animate () {
    if (this.pacmanAnimationTimer == null) {
      return
    }
    this.pacmanAnimationTimer--
    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault
      this.pacmanImageIndex++
      if (this.pacmanImageIndex == this.pacmanImages.length)
        this.pacmanImageIndex = 0
    }
  }
 
    // her kalder jeg at den kan spise de forskellige kugler i dette tilfælde de gule.
  eatDot () {
    if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
    }
  }

  //Her gælder det samme som med de gule her er det mere indviklet, da her skal det også ændre på ting i spillet med at pac-man så kan spise spøgelser og i hvor lang tid skal det være aktivt.
  eatPowerDot () {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotActive = true
      this.powerDotAboutToExpire = false
      this.timers.forEach(timer => clearTimeout(timer))
      this.timers = []

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false
        this.powerDotAboutToExpire = false
      }, 1000 * 4)

      this.timers.push(powerDotTimer)

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true
      }, 1000 * 2)

      this.timers.push(powerDotAboutToExpireTimer)
    }
  }

  //Her tjekker jeg for om pac-man har ramt et hjerte og hvis ja, så skal der tilføjes 1 til liv counteren
  eatHeart () {
    if (this.tileMap.eatHeart(this.x, this.y)) {
      this.life += 1
    }
  }
}
