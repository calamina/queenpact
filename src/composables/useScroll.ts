import { gsap } from 'gsap'
import { onBeforeUnmount, type Ref } from 'vue'

export function useScroll() {
  let scrollTween: gsap.core.Tween | undefined

  const scrollToBottom = () => {
    scrollTween?.kill()

    const element = document.scrollingElement
    if (!(element instanceof HTMLElement)) return

    scrollTween = gsap.to(element, {
      scrollTop: () => element.scrollHeight,
      delay: 0.3,
      duration: 0.75,
      ease: 'sine.out',
    })
  }

  onBeforeUnmount(() => scrollTween?.kill())

  return { scrollToBottom }
}
