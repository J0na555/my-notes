import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Jonas's Garden",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {      // Comment out CustomOgImages to speed up build time

      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "IBM Plex Sans",
        body: "IBM Plex Sans",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          // Brainlkadre rose — light variant (warm off-white + muted rose)
          light: "#faf7f7",        // App + content background
          lightgray: "#ece5e5",    // Borders, dividers, code surfaces
          gray: "#b8a8a8",         // Muted text, graph links
          darkgray: "#5a5050",     // Body text
          dark: "#2b2424",         // Headings, strong text
          secondary: "#b06a6a",    // Links / primary rose accent (contrast-safe on light)
          tertiary: "#c98a8a",     // Hover accent
          highlight: "rgba(176, 106, 106, 0.1)",   // Internal link + selection tint
          textHighlight: "#d4a0a059",              // Highlighted text background
        },
        darkMode: {
          // Brainlkadre rose — dark + rose on near-black
          light: "#0d0d0d",        // App + content background (full-bleed)
          lightgray: "#252525",    // Borders, dividers
          gray: "#666666",         // Muted text, graph links
          darkgray: "#c9c9c9",     // Body text
          dark: "#e8e8e8",         // Headings, strong text
          secondary: "#d4a0a0",    // Links / primary rose accent
          tertiary: "#e8b8b8",     // Hover accent
          highlight: "rgba(212, 160, 160, 0.1)",   // Internal link + selection tint (accent-glow)
          textHighlight: "rgba(212, 160, 160, 0.2)", // Highlighted text background
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
