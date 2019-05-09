"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

(function () {
  var app = {
    init: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = console;
                _context.next = 3;
                return app.getAdvertisers();

              case 3:
                _context.t1 = _context.sent;

                _context.t0.log.call(_context.t0, _context.t1);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }(),
    getAdvertisers: function getAdvertisers() {
      return fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          "operationName": null,
          "variables": {
            "fixedIP": null,
            "fixedPath": "/constructeur"
          },
          "query": "query ($fixedIP: String, $fixedPath: String, $regionProvince: String) {\n  pickAdvertisement(fixedIP: $fixedIP, fixedPath: $fixedPath, regionProvince: $regionProvince) {\n    id\n    companies {\n      id\n      name\n      advertisedLocation\n      logo {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    copy {\n      header\n      subHeader\n      profileLabel\n      actionButton\n      footer\n      footerButton\n      profileAvatar {\n        id\n        url\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
        })
      }).then(function (res) {
        return res.json();
      });
    },
    getChat: function getChat() {
      var query = "mutation ($advertisementId: Int, $companyId: Int) {\n                startChat(advertisementId: $advertisementId, companyId: $companyId) {\n                  session {\n                    token\n                    expiresAt\n                    __typename\n                  }\n                  __typename\n                }\n              }";
    },
    handleData: function handleData(data) {
      console.log(data);
    }
  };
  app.init();
})();