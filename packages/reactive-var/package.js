Package.describe({
  summary: "Reactive variable",
  version: '1.0.13',
});

Package.onUse(function (api) {
  api.export('ReactiveVar');

  api.use(['ecmascript', 'tracker']);

  api.addFiles('reactive-var-client.js', 'client');
  api.addFiles('reactive-var.js', 'server');
  api.addAssets('reactive-var.d.ts', 'server');
});
