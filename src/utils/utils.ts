export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const getRandomInt = (max: number) => Math.floor(Math.random() * max) + 1

export const beforeLeaveFlex = (el: Element) => {
  const htmlEl = el as HTMLElement
  const { width, height } = window.getComputedStyle(htmlEl)

  htmlEl.style.left = `${htmlEl.offsetLeft}px`
  htmlEl.style.top = `${htmlEl.offsetTop}px`
  htmlEl.style.width = width
  htmlEl.style.height = height
}
