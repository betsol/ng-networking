/**
 * betsol-ng-networking - A template project for Angular.js modules
 * @version v0.0.0
 * @link https://github.com/betsol/ng-networking
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (window, angular) {

  'use strict';

  //====================//
  // PRIVATE PROPERTIES //
  //====================//

  var baseUrl = null;


  angular.module('betsol.networking', [])

    //=====================//
    // NETWORKING PROVIDER //
    //=====================//

    .provider('networking', function () {
      var service = {
        applyBaseUrl: applyBaseUrl
      };
      var provider = {
        $get: function () {
          return service;
        }
      };
      provider.setBaseUrl = function (newBaseUrl) {
        baseUrl = newBaseUrl;
      };
      provider.getBaseUrl = function () {
        return baseUrl;
      };
      provider.clearBaseUrl = function () {
        baseUrl = null;
      };
      return provider;
    })

    //=================//
    // REQUEST SERVICE //
    //=================//

    .service('request', ['$http', '$q', function ($http, $q) {
      var service = {};
      service.request = function (method, url, query, body) {
        var config = {
          method: method,
          url: applyBaseUrl(url)
        };
        if (query) {
          config.params = query;
        }
        if (body) {
          config.data = body;
        }
        return $http(config)
          .then(function (httpResponse) {
            return httpResponse.data;
          })
          .catch(function (httpResponse) {
            return $q.reject(httpResponse.data);
          })
        ;
      };
      service.get = function (url, query) {
        return service.request('get', url, query);
      };
      service.post = function (url, query, body) {
        return service.request('post', url, query, body);
      };
      service.put = function (url, query, body) {
        return service.request('put', url, query, body);
      };
      service.delete = function (url, query, body) {
        return service.request('delete', url, query, body);
      };
      return service;
    }])

  ;


  /**
   * @param {string} url
   *
   * @returns {string}
   */
  function applyBaseUrl (url) {
    // No need to do anything if base URL is not defined.
    if (!baseUrl) {
      return url;
    }
    // URL with slash in front considered absolute, no need to apply base URL also.
    if ('/' == url[0]) {
      return url;
    }
    // Making sure slash is present between base URL and specified URL.
    if ('/' != baseUrl.substr(-1, 1)) {
      url = '/' + url;
    }
    return baseUrl + url;
  }

})(window, angular);
