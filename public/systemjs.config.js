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
      'primeng': 'js/vendor/primeng',
      'moment': 'js/vendor/moment/moment.js',
      'text-mask-core': 'js/vendor/text-mask-core',
      'angular2-text-mask': 'js/vendor/angular2-text-mask/dist/angular2TextMask.js',
      //'ng2-currency-mask': 'js/vendor/ng2-currency-mask',
      //'ng2-money-mask': 'js/vendor/ng2-money-mask',
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
      'primeng': { defaultExtension: 'js' },
      'text-mask-core': { defaultExtension: 'js' },
      'angular2-text-mask': { defaultExtension: 'js'},
      //'ng2-currency-mask': { main: 'index.js', defaultExtension: 'js' },
      //'ng2-money-mask': {main: 'index.js', defaultExtension: 'js' }
    };
  System.config({map: map, packages: packages});
})(this);