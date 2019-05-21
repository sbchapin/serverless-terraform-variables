#############
## INPUTS: ##
#############

variable "namespace" {
  description = "A custom namespace for your project. Will prefix bucket and other objects."
}

variable "aws_region" {
  default = "us-west-2"
  description = "The region that all infrastructure will be created in. See https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html for details."
}

variable "aws_profile" {
  default = "personal-admin"
  description = "The AWS profile assumed to create all infrastructure. See https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html for details."
}

##############
## OUTPUTS: ##
##############

output "ping_subnet_id" {
  value = "${module.vpc.public_subnets[0]}"
}

output "aws_profile" {
  value = "${var.aws_profile}"
}

output "aws_region" {
  value = "${var.aws_region}"
}

output "serverless_bucket" {
  value = "${aws_s3_bucket.serverless_deployment.id}"
}


###############
## BEHAVIOR: ##
###############

# https://www.terraform.io/docs/providers/aws/
provider "aws" {
  version = "2.0"
  region  = "${var.aws_region}"
  profile = "${var.aws_profile}"
}

# Where the serverless code gets deployed
resource "aws_s3_bucket" "serverless_deployment" {
  bucket = "${var.namespace}.serverless"
}

# The main VPC (or VPCs) that you now control
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.namespace}-ping-example-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-west-2a"]
  public_subnets  = ["10.0.101.0/24"]
  private_subnets = []

  enable_vpn_gateway = true # expose the public subnet
}
