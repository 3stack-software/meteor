Package.describe({
  summary: "Opt out of sending package stats",
  version: '1.0.8-alpha300.17'
});

Package.onUse(function (api) {
  // Empty. This package's presence tells the meteor tool to stop
  // sending package stats.
});
