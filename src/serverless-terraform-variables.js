const TerraformClient = require('./terraform-client');

class ServerlessTerraformVariables {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    // Client can be brittle, as it attempts to settle terraform problems eagerly:
    try {
      this.terraformClient = this.options.terraformClient || new TerraformClient();
    } catch (err) {
      throw new this.serverless.classes.Error(err.message);
    }

    // Inject custom behavior for terrform variables into serverless' configuration:
    const delegate = serverless.variables.getValueFromSource.bind(serverless.variables);
    // eslint-disable-next-line no-param-reassign
    serverless.variables.getValueFromSource = variableString => {
      if (variableString.startsWith('terraform:')) {
        const variableName = variableString.split('terraform:')[1];
        return this.getOutputVariable(variableName);
      }
      return delegate(variableString);
    };
  }

  getOutputVariable(variableName) {
    // Fetch terraform outputs using client:
    try {
      return this.terraformClient.getOutputVariable(variableName);
    } catch (err) {
      throw new this.serverless.classes.Error(err.message);
    }
  }
}

module.exports = ServerlessTerraformVariables;
