import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.Row([Component.Darkmode(), Component.Search()])],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/J0na555",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({
        spacerSymbol: "❯",
        rootName: "Home",
        resolveFrontmatterTitle: true,
        showCurrentPage: true,
        // leadingWindow: 1,
        // trailingWindow: 1,
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    // Component.PageTitle(),

    // Component.Search(),
    // Component.Darkmode(),

    // Component.OnlyFor(
    //   { titles: [homePageTitle, mapTitle] },
    //   Component.DesktopOnly(Component.RecentNotes({ title: "Most recent", limit: 5 })),
    // ),
    Component.Graph(),
    // Component.DesktopOnly(Component.QuartzTOC()),
    // Component.DesktopOnly(Component.SidebarNav()),
  ],
  right: [
    // Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
    Component.DesktopOnly(
      Component.Explorer({
        // title: "Explore",
        // useSavedState: true,
        // sortFn: (a, b) => {
        //   if ((!a.file && !b.file) || (a.file && b.file)) {
        //     // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
        //     // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
        //     return a.displayName.localeCompare(b.displayName, undefined, {
        //       numeric: true,
        //       sensitivity: "base",
        //     })
        //   }
        //   if (a.file && !b.file) {
        //     return 1
        //   } else {
        //     return -1
        //   }
        // },
      }),
    ),

    // Component.MobileOnly(
    //   Component.RecentNotes({
    //     title: "Most recent",
    //     limit: 5,
    //   }),
    // ),
    //
    Component.MobileOnly(
      Component.Explorer({
        title: "Explore",
        useSavedState: true,
        // sortFn: (a, b) => {
        //   if ((!a.file && !b.file) || (a.file && b.file)) {
        //     // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
        //     // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
        //     return a.displayName.localeCompare(b.displayName, undefined, {
        //       numeric: true,
        //       sensitivity: "base",
        //     })
        //   }
        //   if (a.file && !b.file) {
        //     return 1
        //   } else {
        //     return -1
        //   }
        // },
      }),
    ),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      spacerSymbol: "❯",
      rootName: "Home",
      resolveFrontmatterTitle: true,
      showCurrentPage: true,
      // leadingWindow: 1,
      // trailingWindow: 1,
    }),
    Component.ArticleTitle(),
  ],
  left: [Component.MobileOnly(Component.Spacer())],
  right: [],
}