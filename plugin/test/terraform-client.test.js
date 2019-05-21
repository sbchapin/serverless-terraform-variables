// External dependencies
const { expect, use } = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
// Local dependencies
const TerraformClient = require('../src/terraform-client');
const HelperSingleton = require('./helpers');

use(sinonChai);
use(dirtyChai);

describe('The Terraform client used by the plugin', () => {
  const stubbedStringOptions = HelperSingleton.createOptionStringStub('Terraform v0.0.0');
  const spyingExecSync = sinon.spy(stubbedStringOptions, 'execSync');

  describe('upon immediate creation', () => {
    it('should call out to shell for `terraform version`, `terraform state list`, and `terraform output`', () => {
      const _ = new TerraformClient(stubbedStringOptions); // eslint-disable-line no-unused-vars
      expect(spyingExecSync).to.have.been.calledWith('terraform version');
      expect(spyingExecSync).to.have.been.calledWith('terraform state list');
      expect(spyingExecSync).to.have.been.calledWith('terraform output');
    });
  });

  describe('when calling getOutputVariable', () => {
    it('should call out to shell for `terraform ouput $variableName`', () => {
      const tfClient = new TerraformClient(stubbedStringOptions);
      tfClient.getOutputVariable('terraform_output_variable_name');
      expect(spyingExecSync).to.have.been.calledWith(
        'terraform output terraform_output_variable_name'
      );
    });
  });
});
