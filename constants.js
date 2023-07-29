const DOM_SELECTORS = {
  timer: document.querySelector('#timer'),
  lives: document.querySelector('#lives'),
  record: document.querySelector('#record'),
}

const DEFAULT_CONTROLS = {
  up: ['ArrowUp', 'w', 'W'],
  left: ['ArrowLeft', 'a', 'A'],
  down: ['ArrowDown', 's', 'S'],
  right: ['ArrowRight', 'd', 'D'],
}

const defaultOptions = {
  stage: 0,
  itemSize: 80,
}

const initialCoords = { x: null, y: null }
