# serverless-terraform-variables
[![Build Status](https://travis-ci.org/sbchapin/serverless-terraform-variables.svg?branch=master)](https://travis-ci.org/sbchapin/serverless-terraform-variables)
[![dependencies Status](https://david-dm.org/sbchapin/serverless-terraform-variables/status.svg)](https://david-dm.org/sbchapin/serverless-terraform-variables)
[![devDependencies Status](https://david-dm.org/sbchapin/serverless-terraform-variables/dev-status.svg)](https://david-dm.org/sbchapin/serverless-terraform-variables?type=dev)
[![npm](https://img.shields.io/npm/v/serverless-terraform-variables.svg)](https://www.npmjs.com/package/serverless-terraform-variables)


Interpolation of [terraform output variables](https://www.terraform.io/intro/getting-started/outputs.html) into a [serverless configuration variable source](https://serverless.com/framework/docs/providers/aws/guide/variables#current-variable-sources).

Use terraform to manage the breadth of your networking, data, and auth layers, while using serverless to keep the quickly moving pieces moving quickly.


Simply stated, it allows this:

`main.tf`:
```hcl
resource "aws_sqs_queue" "terraform_queue" {
  name = "terraform-example-queue"
}
output "sqs_id" {
  value = "${aws_sqs_queue.terraform_queue.id}"
}
```

`serverless.yml`:
```yml
functions:
  compute:
    handler: handler.compute
    events:
      - sqs: ${terraform:sqs_id}
```


## Currently work-in-progress, but the initial commit is a fully functioning prototype.

## Why?

**Terraform** and **Serverless** *can* serve the same purpose, but they do so with varying levels of success.

##### **Terraform** _is great at large multi-team shared infrastructure._  

Terraform's functionality of shared & saved state along with its module referencing powers allow it to be used for the majority of a company's provisioned dev ops, and its declarative and configuration-based approach allow it to be easily understood from a high level.  However, terraform is not incredibly easy to pivot and iterate with.

##### **Serverless** _is great at deploying functionality consistently and quickly._

Serverless' highly targeted platform-based approach allows it to be very efficient for any serverless platform, lessening the deploy time and upping the iteration.  In addition, serverless is not restricted to the bounds of configuration - with a rich plugin ecosystem, you can code and do a lot of things with high efficiency.  However, serverless is not terribly easy roll a full infrastructure with (especially with server-ful components).

##### **Serverless-terraform-variables** _allows you to migrate any piece of terraform state forward into serverless._


Serverless-terraform-variables is great at integrating any terraform solution with a serverless solution - you get the both of best worlds while still remaining platform agnostic.  You can take advantage of terraform to inject existing ops-managed infrastructure into a dev-owned environment of lambdas, managing just the deployment of your code with serverless while leaning on terraform to fetch and update any changes of infrastructure state that may affect your deployment.
