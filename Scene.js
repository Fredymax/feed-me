class Scene {
  constructor($canvas, options) {
    this.options = { ...defaultOptions, ...options }
    this.$canvas = $canvas
    this.ctx = $canvas.getContext('2d')
    this.stages = maps
    this.newMovement = null
    this.respawnPosition = { ...initialCoords }
    this.playerPosition = { ...initialCoords }
    this.giftPosition = { ...initialCoords }
    this.lives = 3

    this.audio = {
      stageWon: new MediaAudio('win'),
      stageDead: new MediaAudio('dead', 2.5),
    }

    // 👉 timer
    this.interval = null
    this.timer = null
    this.startGameTimer = null

    this.startGameControls()
    this.createScene()
    this.createTimer()
    this.renderBestScore()
  }

  renderBestScore() {
    DOM_SELECTORS.record.textContent = LocalStorage.getItem('bestScore') || 0
  }

  createTimer(resetTimer = true) {
    if (resetTimer) {
      this.startGameTimer = Math.round(Date.now() / 1000)
      this.timer = null
      DOM_SELECTORS.timer.textContent = '0'
    }
    this.interval = setInterval(() => {
      this.timer = Math.round(Date.now() / 1000) - this.startGameTimer
      DOM_SELECTORS.timer.textContent = this.timer
    }, 1000)
  }

  async createScene() {
    const { appSize, itemSize, innerWidth, innerHeight } = getDimensions()
    this.options.itemSize = itemSize
    this.$canvas.setAttribute('width', appSize + itemSize / 3.5)
    this.$canvas.setAttribute('height', appSize + itemSize / 3.5)

    await this.ctx.clearRect(0, 0, innerWidth, innerHeight)
    this.ctx.fillRect(0, 0, innerWidth, innerHeight)
    this.ctx.font = `${itemSize}px current`
    this.renderScene()
  }

  startGameControls(CONTROLS = DEFAULT_CONTROLS) {
    document.querySelectorAll('.button-controls').forEach(($button) => {
      $button.addEventListener('click', ({ target }) => {
        this.newMovement = target.dataset.direction
        this.movePlayer()
      })
    })
    window.addEventListener('keyup', (ev) => {
      if (!Object.values(CONTROLS).flat().includes(ev.key)) return false
      for (const movement in CONTROLS) {
        if (!CONTROLS[movement].includes(ev.key)) continue
        this.newMovement = movement
        this.movePlayer()
      }
    })
  }

  movePlayer() {
    const { appSize, itemSize } = getDimensions()
    const { x, y } = this.playerPosition
    switch (this.newMovement) {
      case 'up':
        if (x - itemSize <= 0) return
        this.playerPosition.x -= itemSize
        break
      case 'left':
        if (y <= 0) return
        this.playerPosition.y -= itemSize
        break
      case 'down':
        if (x + itemSize > appSize) return
        this.playerPosition.x += itemSize
        break
      default:
        if (y + itemSize + itemSize > appSize) return
        this.playerPosition.y += itemSize
        break
    }
    this.createScene()
  }

  renderScene() {
    const { itemSize, stage } = this.options
    const currentScene = convertMapStringToArray(this.stages[stage])
    if (!currentScene) {
      LocalStorage.setItem('bestScore', this.timer)
      clearInterval(this.interval)
      return
    }

    mainLoop: for (let rowIndex = 0; rowIndex < currentScene.length; rowIndex++) {
      const rowMap = currentScene[rowIndex]
      for (let colIndex = 0; colIndex < rowMap.length; colIndex++) {
        const colMap = rowMap[colIndex]
        const positionY = Math.round(colIndex * itemSize)
        const positionX = Math.round((rowIndex + 1) * itemSize)
        this.ctx.fillText(emojis[colMap], positionY, positionX)
        if (colMap == 'I' && positionX == this.playerPosition.x && positionY == this.playerPosition.y) {
          this.playerPosition.y = null
          this.playerPosition.x = null
          this.options.stage += 1
          this.audio.stageWon.play()
          this.createScene()
          break mainLoop
        } else if (colMap === 'O') {
          this.respawnPosition.x = positionX
          this.respawnPosition.y = positionY
          this.playerPosition.x ??= this.respawnPosition.x
          this.playerPosition.y ??= this.respawnPosition.y
        } else if (colMap == 'X' && this.playerPosition.x == positionX && this.playerPosition.y == positionY) {
          this.audio.stageDead.play()
          this.lives--
          if (this.lives <= 0) {
            this.options.stage = 0
            this.lives = 3
            clearInterval(this.interval)
            this.createTimer(true)
          }
          this.playerPosition.y = null
          this.playerPosition.x = null
          this.createScene()
          break mainLoop
        }
        DOM_SELECTORS.lives.textContent = `${this.lives} live${this.lives == 1 ? '' : 's'}`
        setTimeout(() => this.ctx.fillText(emojis['PLAYER'], this.playerPosition.y, this.playerPosition.x), 10)
      }
    }
  }
}
