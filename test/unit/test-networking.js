describe('Networking Service', function () {

  //==============//
  // INITIALIZING //
  //==============//

  beforeEach(module('betsol.networking'));

  var networkingProvider;
  beforeEach(module(function (_networkingProvider_) {
    networkingProvider = _networkingProvider_;
  }));

  var networking;
  beforeEach(inject(function (_networking_) {
    networking = _networking_;
  }));


  //=========//
  // TESTING //
  //=========//

  it('service provider should be present', function () {
    expect(networkingProvider).to.be.an('object');
  });

  it('service should be present', function () {
    expect(networking).to.be.an('object');
  });

  it('all public methods of networking provider are exposed', function () {
    expect(networkingProvider.setBaseUrl).to.be.a('function');
    expect(networkingProvider.getBaseUrl).to.be.a('function');
    expect(networkingProvider.clearBaseUrl).to.be.a('function');
  });

  it('URLs are properly merged', function () {

    networkingProvider.setBaseUrl('/api');
    expect(networking.applyBaseUrl('users')).to.be.equal('/api/users');
    expect(networking.applyBaseUrl('/users')).to.be.equal('/users');

    networkingProvider.setBaseUrl('/api/');
    expect(networking.applyBaseUrl('users')).to.be.equal('/api/users');
    expect(networking.applyBaseUrl('/users')).to.be.equal('/users');

    networkingProvider.clearBaseUrl();
    expect(networking.applyBaseUrl('users')).to.be.equal('users');
    expect(networking.applyBaseUrl('/users')).to.be.equal('/users');

  });

});
