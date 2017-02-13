module.exports = {
  okapi: { 'url':'http://localhost:9130', 'tenant':'diku' },
  config: { reduxLog: true, disableAuth: true },
  modules: {
    '@folio-sample-modules/trivial': {},
    '@folio-sample-modules/trivial-okapi': {},
    '@folio-sample-modules/users': {},
  }
};
