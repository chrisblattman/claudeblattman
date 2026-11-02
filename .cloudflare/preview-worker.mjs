// Used only by `wrangler preview`. Production remains on GitHub Pages.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
