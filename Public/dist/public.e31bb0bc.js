// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
"use strict";

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.endsWith('login.html')) {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    prefillUsername(); // Prefill the username if it's saved in localStorage
  } else {
    // Show the main page

    // Show band availability section for band users
    if (localStorage.getItem('userType') === 'band') {
      document.getElementById('band-availability').style.display = 'block';
    } else {
      document.getElementById('band-availability').style.display = 'none';
      var reserveBandElement = document.getElementById('reserve-band'); // Replace with lement ID
      if (reserveBandElement) {
        reserveBandElement.addEventListener('click', checkLoginAndRedirect);
      }
    }
    fetchBands();
  }
});
function fetchBands() {
  fetch('/api/bands').then(function (response) {
    return response.json();
  }).then(function (bands) {
    var bandsList = document.getElementById('bands-list');
    bands.forEach(function (band) {
      var bandDiv = document.createElement('div');
      bandDiv.innerHTML = "<h3>".concat(band.name, "</h3><p>").concat(band.description, "</p>");
      bandDiv.addEventListener('click', function () {
        return showBandDetails(band.id);
      });
      bandsList.appendChild(bandDiv);
    });
  }).catch(function (error) {
    console.error('Error fetching bands:', error);
  });
}
function handleLogin(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  // Test if the username and password match the specific credentials
  if (username === 'Alice' && password === '1234') {
    // Perform the login actions
    localStorage.setItem('username', username);
    var userType = document.getElementById('userType').value;
    localStorage.setItem('userType', userType);

    // Redirect to main page or show success message
    window.location.href = 'index.html'; // Redirect to the main page after login
  } else {
    // Handle login failure
    alert('Login failed. Please try again.');
  }
}

/* 
event.preventDefault();
const username = document.getElementById('username').value;
const password = document.getElementById('password').value;
  // Saving username to localStorage
localStorage.setItem('username', username);
const userType = document.getElementById('userType').value;
localStorage.setItem('userType', userType);
  // Replace with your API endpoint
fetch('/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        // Handle successful login
        // Redirect to main page or show success message
        window.location.href = 'index.html'; // Redirect to the main page after login
    } else {
        // Handle login failure
        alert('Login failed. Please try again.');
    }
})
.catch(error => {
    console.error('Error during login:', error);
    alert('An error occurred while attempting to log in.');
});
*/

function prefillUsername() {
  var savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
  }
}
function checkLoginAndRedirect(event) {
  event.preventDefault(); // Prevent default action if it's a link

  // Check if user is logged in
  if (localStorage.getItem('username')) {
    window.location.href = 'reserve.html'; // Redirect to reservation page
  } else {
    window.location.href = 'login.html'; // Redirect to login page
  }
}

function showReservationForm() {
  // Logic to show reservation form after successful login
  var reservationSection = document.getElementById('reserve');
  if (localStorage.getItem('userType') === 'venue') {
    reservationSection.style.display = 'block';
  } else {
    reservationSection.style.display = 'none';
  }
  // Populate reservation form fields as necessary
}

function showBandDetails(bandId) {
  fetch("/api/bands/".concat(bandId)).then(function (response) {
    return response.json();
  }).then(function (bandDetails) {
    // Display band details in a specific section or modal
  }).catch(function (error) {
    console.error('Error fetching band details:', error);
  });
}
document.getElementById('reservation-form').addEventListener('submit', handleReservation);
function handleReservation(event) {
  event.preventDefault();
  var time = document.getElementById('time').value;
  var venueId = document.getElementById('venueId').value;
  var bandId = document.getElementById('bandId').value;

  // Constructing the reservation data object
  var reservationData = {
    time: time,
    venueId: parseInt(venueId, 10),
    // Convert to integer as your database expects an INTEGER
    bandId: parseInt(bandId, 10) // Convert to integer
  };

  // API call to reserve a band
  fetch('/api/reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reservationData)
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.success) {
      // Handle successful reservation
      alert("Reservation confirmed! Confirmation ID: ".concat(data.reservationId));
      // Optionally, clear the form or redirect the user
    } else {
      // Handle reservation failure
      alert('Reservation failed. Please try again.');
    }
  }).catch(function (error) {
    console.error('Error making reservation:', error);
    alert('An error occurred while making the reservation.');
  });
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53144" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/public.e31bb0bc.js.map