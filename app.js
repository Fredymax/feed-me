const $canvas = document.querySelector('#game')
const app = document.querySelector('#app')

window.addEventListener('resize', startGame)
$buttonStart.addEventListener('click', () => startGame())

function startGame() {
  $dialog.close()
  app.classList.remove('hidden')
  new Scene($canvas, { stage: 0 })
}
