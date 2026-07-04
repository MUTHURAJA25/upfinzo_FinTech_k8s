output "cluster_name" {

  value = aws_eks_cluster.eks.name

}

output "cluster_arn" {

  value = aws_eks_cluster.eks.arn

}

output "cluster_endpoint" {

  value = aws_eks_cluster.eks.endpoint

}