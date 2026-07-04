provider "aws" {

  region     = "us-east-1"
  access_key = "test"
  secret_key = "test"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
  eks      = "http://172.17.0.3:4566"
  ec2      = "http://172.17.0.3:4566"
  iam      = "http://172.17.0.3:4566"
  sts      = "http://172.17.0.3:4566"
  s3       = "http://172.17.0.3:4566"
  dynamodb = "http://172.17.0.3:4566"
  }
}