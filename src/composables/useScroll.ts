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
      delay: 0.1,
      duration: 0.7,
      ease: 'power2.out',
    })
  }

  onBeforeUnmount(() => scrollTween?.kill())

  return { scrollToBottom }
}
