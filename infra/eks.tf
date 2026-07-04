resource "aws_eks_cluster" "eks" {

  name     = var.cluster_name

  role_arn = local.cluster_role_arn

  vpc_config {

    subnet_ids = local.subnet_ids

  }

}