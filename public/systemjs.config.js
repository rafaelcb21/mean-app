(function (global) {
  var map = {
      'app': 'js/app',
      '@angular/core': 'js/vendor/@angular/core',
      '@angular/common': 'js/vendor/@angular/common',
      '@angular/compiler': 'js/vendor/@angular/compiler',
      '@angular/platform-browser': 'js/vendor/@angular/platform-browser',
      '@angular/platform-browser-dynamic': 'js/vendor/@angular/platform-browser-dynamic',
      '@angular/http': 'js/vendor/@angular/http',
      '@angular/router': 'js/vendor/@angular/router',
      '@angular/forms': 'js/vendor/@angular/forms',
	  '@angular/upgrade': 'js/vendor/@angular/upgrade',
      'rxjs': 'js/vendor/rxjs',
    },

    packages = {
      'app': { main: 'boot.js', defaultExtension: 'js' },
      'rxjs': { defaultExtension: 'js' },
      '@angular/core': { main: 'bundles/core.umd.js', defaultExtension: 'js' },
      '@angular/common': { main: 'bundles/common.umd.js', defaultExtension: 'js' },
      '@angular/compiler': { main: 'bundles/compiler.umd.js', defaultExtension: 'js' },
      '@angular/platform-browser': { main: 'bundles/platform-browser.umd.js', defaultExtension: 'js' },
      '@angular/platform-browser-dynamic': { main: 'bundles/platform-browser-dynamic.umd.js', defaultExtension: 'js' },
      '@angular/http': { main: 'bundles/http.umd.js', defaultExtension: 'js' },
      '@angular/router': { main: 'bundles/router.umd.js', defaultExtension: 'js' },
      '@angular/forms': { main: 'bundles/forms.umd.js', defaultExtension: 'js' },
	  '@angular/upgrade': { main: 'bundles/upgrade.umd.js', defaultExtension: 'js' },
    };
  System.config({map: map, packages: packages});
})(this);