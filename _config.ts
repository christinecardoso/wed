import lume from "lume/mod.ts";
import plugins from "./plugins.ts";
import cacheBusting from "lume/middlewares/cache_busting.ts";

const site = lume({
  src: "./src",
  server: {
    middlewares: [cacheBusting()],
  },
});

site.use(plugins());

export default site;
