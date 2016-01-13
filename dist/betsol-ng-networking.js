/**
 * betsol-ng-networking - Convenient networking in Angular.js
 * @version v0.0.2
 * @link https://github.com/betsol/ng-networking
 * @license MIT
 *
 * @author Slava Fomin II <s.fomin@betsol.ru>
 */
(function (angular) {

  'use strict';

  //====================//
  // PRIVATE PROPERTIES //
  //====================//

  var baseUrl = null;

  var defaultConfig = {
    fullResponseOnSuccess: false,
    fullResponseOnError: false
  };

  var globalConfig = angular.copy(defaultConfig);


  angular.module('betsol.networking', [])

    //====================//
    // NETWORKING SERVICE //
    //====================//

    .provider('networking', function () {
      var service = {
        setGlobalConfig: setGlobalConfig,
        extendGlobalConfig: extendGlobalConfig,
        setBaseUrl: setBaseUrl,
        getBaseUrl: getBaseUrl,
        clearBaseUrl: clearBaseUrl,
        applyBaseUrl: applyBaseUrl
      };
      var provider = {
        $get: function () {
          return service;
        },
        setGlobalConfig: setGlobalConfig,
        extendGlobalConfig: extendGlobalConfig,
        setBaseUrl: setBaseUrl,
        getBaseUrl: getBaseUrl,
        clearBaseUrl: clearBaseUrl,
        applyBaseUrl: applyBaseUrl
      };
      return provider;
    })

    //=================//
    // REQUEST SERVICE //
    //=================//

    .service('request', ['$http', '$q', function ($http, $q) {
      var service = {};
      service.request = function (method, url, query, body, config) {
        var httpConfig = angular.extend({}, globalConfig, {
          method: method,
          url: applyBaseUrl(url)
        });
        if (query) {
          httpConfig.params = query;
        }
        if (body) {
          httpConfig.data = body;
        }
        if (config) {
          angular.extend(httpConfig, config);
        }
        return $http(httpConfig)
          .then(function (httpResponse) {
            return (httpConfig.fullResponseOnSuccess ? httpResponse : httpResponse.data);
          })
          .catch(function (httpResponse) {
            return $q.reject(
              httpConfig.fullResponseOnError ? httpResponse : httpResponse.data
            );
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
    }])

  ;


  /**
   * Replaces global config with the specified one.
   *
   * @param {object} config
   */
  function setGlobalConfig (config) {
    globalConfig = angular.extend({}, defaultConfig, config);
  }

  /**
   * Extends global config with the specified parameters.
   *
   * @param {object} config
   */
  function extendGlobalConfig (config) {
    angular.extend(globalConfig, config);
  }

  function setBaseUrl (newBaseUrl) {
    baseUrl = newBaseUrl;
  }

  function getBaseUrl () {
    return baseUrl;
  }

  function clearBaseUrl () {
    baseUrl = null;
  }

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

})(angular);
