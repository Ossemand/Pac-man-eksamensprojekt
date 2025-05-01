import Pacman from './pac-man.js'
import MovingDirection from './bevægelsesretning.js'
import Ghosts from './spøgelse.js'


  //constructoren laver de forskellige billeder og intialiserer hvor stor en flise i spillet skal være. Her har jeg også valgt at bestemme, hvor langt tid en powerdot skal virke og det er 30 sekunder.
export default class TileMap {
  constructor (tileSize) {
    this.tileSize = tileSize
    this.yellowDot = new Image()
    this.yellowDot.src = 'images/yellowDot.png'

    this.pinkDot = new Image()
    this.pinkDot.src = 'images/pinkDot.png'

    this.wall = new Image()
    this.wall.src = 'images/vægge copy.png.jpeg'

    this.heart = new Image()
    this.heart.src = 'images/heart.png.jpeg.png'

    this.powerDot = this.pinkDot
    this.powerDotAnmationTimerDefault = 20
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault
  }

 //her laver jeg banen, hvor 1 er vægge, 0 er, hvor man kan gå/gule prikker. 4 er pac-man altså vores karakter, 6 er powerprikken og 5 er spøgelserne.
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 1, 0, 0, 0, 0, 6, 5, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 7, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 6, 1, 0, 0, 7, 1, 6, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 5, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 6, 1, 0, 1, 6, 0, 0, 0, 0, 1, 0, 0, 5, 6, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 5, 6, 0, 0, 0, 1, 0, 0, 6, 0, 0, 0, 0, 0, 6, 1, 0, 1],
    [1, 6, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 5, 1],
    [1, 0, 0, 1, 5, 0, 0, 0, 0, 6, 0, 0, 5, 0, 0, 1, 6, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 1, 0, 0, 0, 0, 0, 0, 6, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 7, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]
 

  //Her går jeg igennem de forskellige værdier i arrayet og kalder, hvis det er 1 skal den tegne en væg, hvis det er 0 skal den tegne en normal dot, hvis det er 5 skal den tegne en powerdot og hvis det er 7 skal den tegne et hjerte og eller blank.
  draw (ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column]
        if (tile === 1) {
          this.drawWall(ctx, column, row, this.tileSize)
        } else if (tile === 0) {
          this.drawDot(ctx, column, row, this.tileSize)
        } else if (tile == 5) {
          this.drawPowerDot(ctx, column, row, this.tileSize)
        } else if (tile === 7) {
          this.drawHeart(ctx, column, row, this.tileSize)
        } else {
          this.drawBlank(ctx, column, row, this.tileSize)
        }
      }
    }
  }

  // her tegner jeg dotten med den størrelse den skal havde og billedet specifikt.
  drawDot (ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    )
  }

    //tegner en powerdot, samt at den flasher, ved at skifte mellem at vise en normal dot og en powerdot og, hvor langt tid der skal gå imellem den skifter.
  drawPowerDot (ctx, column, row, size) {
    this.powerDotAnmationTimer--
    if (this.powerDotAnmationTimer === 0) {
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot
      } else {
        this.powerDot = this.pinkDot
      }
    }
    ctx.drawImage(this.powerDot, column * size, row * size, size, size)
  }

  // her tegner jeg væg med størrelse og det valgt billedet fra constructoren.
  drawWall (ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    )
  }
  
// Her tegner jeg et hjerte. 
  drawHeart (ctx, column, row, size) {
    ctx.drawImage(
      this.heart,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    )
  }

    // her tegner jeg, hvis det er pac-man har spist en dot, hvad den så skal vise.
  drawBlank (ctx, column, row, size) {
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size)
  }

 // Her laver jeg pac-man ved at, hvis det er 4, som feltet er skal den retunerer en pac-man, samt dens størrelse
  getPacman (velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column]
        if (tile === 4) {
          this.map[row][column] = 0
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          )
        }
      }
    }
  }
 
  // Her pusher jeg for at tegne et spøgelse, hvis det er værdien 6 feltet har, som har det givet størrelse og bevægelses mønster.
  getGhost (velocity) {
    const ghost = []

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column]
        if (tile == 6) {
          this.map[row][column] = 0
          ghost.push(
            new Ghosts(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          )
        }
      }
    }
    return ghost
  }

    // her indstiller jeg bredden og højden på banen.
  setCanvasSize (canvas) {
    canvas.width = this.map[0].length * this.tileSize
    canvas.height = this.map.length * this.tileSize
  }

   // Her tjekker jeg om enten pac-man eller et spøgelse rammer en væg og beregner den næste potentielle position baseret på hvilken retning karakteren bevæger sig i og returnere om det er true eller false om pac-man eller et spøgelse rammer en væg.
  didCollideWithEnvironment (x, y, direction) {
    if (direction == null) {
      return
    }
  
    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let column = 0
      let row = 0
      let nextColumn = 0
      let nextRow = 0

      switch (direction) {
        case MovingDirection.right:
          nextColumn = x + this.tileSize
          column = nextColumn / this.tileSize
          row = y / this.tileSize
          break
        case MovingDirection.left:
          nextColumn = x - this.tileSize
          column = nextColumn / this.tileSize
          row = y / this.tileSize
          break
        case MovingDirection.up:
          nextRow = y - this.tileSize
          row = nextRow / this.tileSize
          column = x / this.tileSize
          break
        case MovingDirection.down:
          nextRow = y + this.tileSize
          row = nextRow / this.tileSize
          column = x / this.tileSize
          break
      }
      const tile = this.map[row][column]
      if (tile === 1) {
        return true
      }
    }
    return false
  }
  
   // her tjekker jeg, om man har vundet ved om der er 0 dots tilbage
  didWin () {
    return this.dotsLeft() === 0
  }


// her tjekkes om hvor mange der er tilbage
  dotsLeft () {
    return this.map.flat().filter(tile => tile === 0).length
  }
  
   // Her tjekkes det om pac-man rører ved en dot og, hvis ja bliver den spist.
  eatDot (x, y) {
    const row = y / this.tileSize
    const column = x / this.tileSize
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 0) {
        this.map[row][column] = 4
        return true
      }
    }
    return false
  }
 
  // det samme er gældende her. her tjekkes om han spiser en powerdot.
  eatPowerDot (x, y) {
    const row = y / this.tileSize
    const column = x / this.tileSize
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column]
      if (tile === 5) {
        this.map[row][column] = 4
        return true
      }
    }
    return false
  }
  
// her tjekkes der også for om der er blevet spist et hjerte. 
  eatHeart (x, y) {
    const row = y / this.tileSize
    const column = x / this.tileSize
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column]
      if (tile === 7) {
        this.map[row][column] = 4
        return true
      }
    }
    return false
  }
}