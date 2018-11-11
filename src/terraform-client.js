const { execSync } = require('child_process');

class TerraformClient {
  constructor(options) {
    if (options && options.execSync) {
      this.execSync = options.execSync;
    } else {
      this.execSync = execSync;
    }
    this.outputVariableCache = {};

    // Sanity check for terraform:
    try {
      const stdout = this.execSync('terraform version').toString('utf8');
      const validVersionRegex = /\bv\d+([.]\d+){2}\b/;
      if (!stdout.match(validVersionRegex)) {
        throw new Error(`Could not parse version of terraform from the following: ${stdout}`);
      }
    } catch (err) {
      throw new Error(
        `Problem retrieving version of terraform.\n` +
          `  Terraform must be installed to use serverless-terraform-variables.\n` +
          `  Internal error message follows: ${err.message}`,
          err
      );
    }
    // Sanity check for terraform state:
    try {
      this.execSync('terraform state show');
    } catch (err) {
      throw new Error(
        `Could not retrieve terraform state.\n` +
          `  Make sure you have initialized terraform and acquired state via 'terraform init' with the correct terraform backend.\n` +
          `  Internal error message follows: ${err.message}`,
          err
      );
    }
    // Sanity check for terraform outputs:
    try {
      this.execSync('terraform output');
    } catch (err) {
      throw new Error(
        `Could not retrieve terraform output from terraform state.\n` +
          `  Make sure you have initialized terraform and can acquired outputs from the terraform state via 'terraform output' command.\n` +
          `  Internal error message follows: ${err.message}`,
          err
      );
    }
  }

  getOutputVariable(variableName) {
    // Cache-lookup short-circuit:
    if (this.outputVariableCache[variableName]) {
      return this.outputVariableCache[variableName];
    }

    try {
      // Fetch via external execution:
      const outputVariableValue = this.execSync(`terraform output ${variableName}`)
        .toString('utf8')
        .trim();

      // Cache for subsequent lookups:
      this.outputVariableCache[variableName] = outputVariableValue;

      // Return value found via terraform:``
      return outputVariableValue;
    } catch (err) {
      throw new Error(
        `Could not retrieve terraform output variable of name '${variableName}' from terraform state.\n` +
          `  Make sure you have defined an output of that name in terraform.\n` +
          `  Internal error message follows: ${err.message}`,
          err
      );
    }
  }
}
module.exports = TerraformClient;
