import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/gardenfx.inline"
import style from "./styles/gardenfx.scss"

// Decorative "living garden" effects: floating particles + scroll-progress vine.
// Markup is created on document.body by the inline script so the fixed-position
// layers are never clipped by transformed ancestors (e.g. the mobile drawer).
const GardenFX: QuartzComponent = () => {
  return <></>
}

GardenFX.css = style
GardenFX.afterDOMLoaded = script

export default (() => GardenFX) satisfies QuartzComponentConstructor
