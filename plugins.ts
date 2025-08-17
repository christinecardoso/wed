import date, { Options as DateOptions } from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import prism, { Options as PrismOptions } from "lume/plugins/prism.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import metas from "lume/plugins/metas.ts";
import pagefind, { Options as PagefindOptions } from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import feed, { Options as FeedOptions } from "lume/plugins/feed.ts";
import readingInfo from "lume/plugins/reading_info.ts";
import { merge } from "lume/core/utils/object.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.9.0/toc.ts";
import image from "https://deno.land/x/lume_markdown_plugins@v0.9.0/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins@v0.9.0/footnotes.ts";
import { alert } from "npm:@mdit/plugin-alert@0.22.0";

import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";
import wikilinks from "https://deno.land/x/lume_markdown_plugins/wikilinks.ts";
import markdownItContainer from "npm:markdown-it-container";
import mdItObsidianCallouts from "npm:markdown-it-obsidian-callouts";
import obsidianImages from "npm:markdown-it-obsidian-images";
import attrs from "npm:markdown-it-attrs";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import icons from "lume/plugins/icons.ts";
import typography from "npm:@tailwindcss/typography";
import simpleIcons from "https://deno.land/x/lume_icon_plugins@v0.1.1/simpleicons.ts";
import markdownItAnchor from 'npm:markdown-it-anchor';
import svgo from "lume/plugins/svgo.ts";
import inline from "lume/plugins/inline.ts";

import "lume/types.ts";

export interface Options {
  prism?: Partial<PrismOptions>;
  date?: Partial<DateOptions>;
  pagefind?: Partial<PagefindOptions>;
  feed?: Partial<FeedOptions>;
}

export const defaults: Options = {
  feed: {
    output: ["/feed.xml", "/feed.json"],
    query: "type=post",
    info: {
      title: "=metas.site",
      description: "=metas.description",
    },
    items: {
      title: "=title",
    },
  },
};

/** Configure the site */
export default function (userOptions?: Options) {
  const options = merge(defaults, userOptions);

  return (site: Lume.Site) => {
    site.use(icons())
      .use(tailwindcss({
        /* Options */
        // Extract the classes from HTML and JSX files
        extensions: [".html", ".jsx"],

        // Your Tailwind options, like the theme colors and fonts
        options: {
          theme: {
            colors: {
              blue: "#1fb6ff",
              purple: "#7e5bef",
              pink: "#ff49db",
            },
            fontFamily: {
              sans: ["Graphik", "sans-serif"],
              serif: ["Canela", "serif"],
              display: ["Carloti", "serif"]
            },
          },
          plugins: [typography],
        },
      }))
      .use(postcss())
      .use(basePath())
      .use(toc())
      .use(prism(options.prism))
      .use(readingInfo())
      .use(date(options.date))
      .use(metas())
      .use(image())
      .use(footnotes())
      .use(resolveUrls())
      .use(slugifyUrls())
      .use(terser())
      .use(pagefind(options.pagefind))
      .use(sitemap())
      .use(feed(options.feed))
      .use(wikilinks())
      .use(picture(/* Options */))
      .use(transformImages({
        extensions: [".jpg", ".png", ".webp"], // exclude .gif
        include: ["**/*.jpg", "**/*.png"], // Apply plugin to these patterns
        options: {
          // Specify output formats and sizes
          formats: ["webp", "avif", "jpg"],
          sizes: [640, 1080],  // Define the sizes you want to generate
        },
        functions: {
          resizeBlur(img, size) {
            img.resize(size, size);
            img.blur(10);
          },
        },
      }))
      .use(simpleIcons())
      .use(svgo())
      .use(inline())
      .add("fonts")
      .add([".css"])
      .add("js")
      .add("favicon.png")
      .add("uploads")
      .mergeKey("extra_head", "stringArray")
      .preprocess([".md"], (pages) => {
        for (const page of pages) {
          page.data.excerpt ??= (page.data.content as string).split(
            /<!--\s*more\s*-->/i,
          )[0];
        }
      });

    // Alert plugin
    site.hooks.addMarkdownItPlugin(alert);
    site.hooks.addMarkdownItPlugin(mdItObsidianCallouts);
    site.hooks.addMarkdownItPlugin(obsidianImages);
    site.hooks.addMarkdownItPlugin(attrs); // for {.class} support
    for (const type of ["div", "tip", "warning", "info", "note"]) {
      site.hooks.addMarkdownItPlugin(markdownItContainer, type);
    }
    site.hooks.addMarkdownItPlugin(markdownItAnchor);

    // Mastodon comment system
    site.remoteFile(
      "/js/comments.js",
      "https://cdn.jsdelivr.net/npm/@oom/mastodon-comments@0.3.2/src/comments.js",
    );
  };
}
