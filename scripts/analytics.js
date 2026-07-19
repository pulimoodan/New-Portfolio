// Google Analytics (gtag.js)
(function () {
  var MEASUREMENT_ID = "G-D38Q6Y8X5C";

  var loader = document.createElement("script");
  loader.async = true;
  loader.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(loader);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    dataLayer.push(arguments);
  };
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID);
})();

window.trackGame = function (event, gameName, params) {
  if (typeof gtag !== "function") return;
  gtag("event", event, Object.assign({ game_name: gameName }, params || {}));
};
