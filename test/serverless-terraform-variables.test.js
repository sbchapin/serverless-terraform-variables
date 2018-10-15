// External dependencies
const { expect, use } = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// Local dependencies
const HelperSingleton = require('./helpers');

use(sinonChai);
use(dirtyChai);

describe('The stubbed plugin', () => {
  const stubbedServerless = HelperSingleton.createServerlessStub();
  const stubbedTerraformClient = HelperSingleton.createTerraformClientStub();

  describe('extends serverless.variables.getValueFromSource in-place', () => {
    it('should detect variables prefixed with "terraform:"', () => {
      const plugin = HelperSingleton.createPluginStub(stubbedServerless, stubbedTerraformClient);
      const spy = sinon.spy(plugin, 'getOutputVariable');
      plugin.serverless.variables.getValueFromSource('terraform:test_output_value');
      expect(spy).to.have.been.calledWith('test_output_value');
    });

    it('should not detect variables unless prefixed with "terraform:"', () => {
      const plugin = HelperSingleton.createPluginStub(stubbedServerless, stubbedTerraformClient);
      const spy = sinon.spy(plugin, 'getOutputVariable');
      plugin.serverless.variables.getValueFromSource('test_output_value');
      expect(spy).to.not.have.been.called();
    });
  });
});
