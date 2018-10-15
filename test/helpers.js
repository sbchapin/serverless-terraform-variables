const ServerlessTerraformVariables = require('../src/serverless-terraform-variables');

/* eslint-disable class-methods-use-this */

class Variables {
  constructor(message) {
    this.testValue = `serverless.variables.stubbedValueFromSource - ${message}`;
  }

  getValueFromSource() {
    return this.testValue;
  }
}

class Error {
  constructor(message) {
    this.message = `StubbedErrorClass - ${message}`;
  }
}

class Helpers {
  createServerlessStub() {
    return {
      variables: new Variables(),
      classes: {
        Error,
      },
    };
  }

  createTerraformClientStub() {
    return {
      getOutputVariable() {},
    };
  }

  createPluginStub(stubbedServerless, stubbedTerraformClient) {
    return new ServerlessTerraformVariables(stubbedServerless, {
      terraformClient: stubbedTerraformClient,
    });
  }

  createOptionStringStub(bufferString) {
    return {
      execSync() {
        return {
          toString() {
            return bufferString;
          },
        };
      },
    };
  }
}
module.exports = new Helpers();
