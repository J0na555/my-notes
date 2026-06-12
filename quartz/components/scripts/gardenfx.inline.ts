const PARTICLE_TYPES = ["particle--leaf", "particle--spore", "particle--dust"]
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

function buildParticles(field: HTMLElement) {
  field.replaceChildren()
  const count = window.innerWidth < 768 ? 10 : 22
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div")
    el.className = `particle ${PARTICLE_TYPES[i % PARTICLE_TYPES.length]}`
    const dur = 14 + Math.random() * 18
    el.style.left = `${Math.random() * 100}%`
    el.style.animationDuration = `${dur}s`
    el.style.animationDelay = `${-(Math.random() * dur)}s`
    el.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 80}px`)
    el.style.setProperty("--drift-rot", `${Math.random() * 360}deg`)
    field.appendChild(el)
  }
}

function ensureEl<T extends HTMLElement>(id: string, make: () => T): T {
  const existing = document.getElementById(id) as T | null
  if (existing) return existing
  const el = make()
  el.id = id
  document.body.appendChild(el)
  return el
}

function setup() {
  // Respect reduced-motion: tear down any existing layers and bail.
  if (reduceMotion()) {
    document.getElementById("fx-particle-field")?.remove()
    document.getElementById("fx-scroll-vine")?.remove()
    return
  }

  // --- Floating particle field ---
  const field = ensureEl("fx-particle-field", () => {
    const el = document.createElement("div")
    el.className = "particle-field"
    el.setAttribute("aria-hidden", "true")
    return el
  })
  buildParticles(field)

  // --- Scroll-progress vine ---
  const vine = ensureEl("fx-scroll-vine", () => {
    const el = document.createElement("div")
    el.className = "scroll-vine"
    el.setAttribute("aria-hidden", "true")
    el.innerHTML = `
      <div class="vine-track"><div class="vine-fill"></div></div>
      <div class="vine-bud"></div>
      <div class="vine-leaf vine-leaf-1"></div>
      <div class="vine-leaf vine-leaf-2"></div>`
    return el
  })

  const fill = vine.querySelector<HTMLElement>(".vine-fill")!
  const bud = vine.querySelector<HTMLElement>(".vine-bud")!
  const leaf1 = vine.querySelector<HTMLElement>(".vine-leaf-1")!
  const leaf2 = vine.querySelector<HTMLElement>(".vine-leaf-2")!

  const update = () => {
    const doc = document.documentElement
    const scrolled = doc.scrollTop || document.body.scrollTop
    const total = doc.scrollHeight - doc.clientHeight
    const pct = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0
    const h = vine.clientHeight

    fill.style.height = `${pct * 100}%`
    bud.style.top = `${pct * h}px`
    bud.classList.toggle("visible", pct > 0.01 && pct < 0.99)

    leaf1.style.top = `${h * 0.33}px`
    leaf2.style.top = `${h * 0.66}px`
    leaf1.classList.toggle("visible", pct > 0.3)
    leaf2.classList.toggle("visible", pct > 0.6)
  }

  const onResize = () => {
    buildParticles(field)
    update()
  }

  update()
  window.addEventListener("scroll", update, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })

  // SPA cleanup: drop listeners before the next navigation re-runs setup().
  window.addCleanup(() => {
    window.removeEventListener("scroll", update)
    window.removeEventListener("resize", onResize)
  })
}

document.addEventListener("nav", setup)
