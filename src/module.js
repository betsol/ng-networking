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

    .service('request', function ($http, $q) {
      var service = {};
      service.request = function (method, url, query, body, config) {
        var _config = {
          method: method,
          url: applyBaseUrl(url)
        };
        if (query) {
          _config.params = query;
        }
        if (body) {
          _config.data = body;
        }
        if (config) {
          Angular.extend(_config, config);
        }
        return $http(_config)
          .then(function (httpResponse) {
            return httpResponse.data;
          })
          .catch(function (httpResponse) {
            return $q.reject(httpResponse.data);
          })
        ;
      };
      service.head = function (url, query, config) {
        return service.request('head', url, query, null, config);
      };
      service.get = function (url, query, config) {
        return service.request('get', url, query, null, config);
      };
      service.post = function (url, query, body, config) {
        return service.request('post', url, query, body, config);
      };
      service.put = function (url, query, body, config) {
        return service.request('put', url, query, body, config);
      };
      service.patch = function (url, query, body, config) {
        return service.request('patch', url, query, body, config);
      };
      service.delete = function (url, query, body, config) {
        return service.request('delete', url, query, body, config);
      };
      return service;
    })

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
