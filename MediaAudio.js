class MediaAudio {
  constructor(name, velocity) {
    this.media = new Audio(`./sounds/${name}.mp3`)
    this.media.volume = 1
    if (velocity) {
      this.media.playbackRate = velocity
    }
  }

  play() {
    this.media.play()
  }
}
