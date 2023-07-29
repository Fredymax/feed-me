function getDimensions() {
  const innerWidth = window.innerWidth
  const innerHeight = window.innerHeight
  let appSize
  if (innerWidth > innerHeight) {
    appSize = innerHeight * 0.6
  } else {
    appSize = innerWidth * 0.8
  }
  const itemSize = Math.round(appSize / 10)
  return { innerWidth, innerHeight, appSize, itemSize }
}

function convertMapStringToArray(string) {
  if (!string) return
  let newMap = string.trim().split('\n')
  newMap = newMap.map((c) => {
    return c
      .trim()
      .split('\n')
      .map((c) => c.trim().split(''))
  })
  return newMap.flat()
}
