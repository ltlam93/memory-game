chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'bounds': {
      'width': 800,
      'height': 700
    },
    'maxWidth':800,
    'minWidth':800,
    'maxHeight':700,
    'minHeight':700
  });
});
