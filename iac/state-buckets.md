# State Bucket Reference
These are the state buckets for various accounts:

| Account        | Bucket Name               | 
|----------------|---------------------------| 
| DMA Sandbox    | as-dma-sbx-tfstate        | 
| DMA Nonprod    | as-dma-nonprod-tfstate    | 
| DMA Production | nit-et-ia-build-tfstate   | 
| ADO Sandbox    | as-ado-sbx-tfstate        | 
| ADO Nonprod    | ado-nonprod-build-tfstate | 
| ADO Production | ado-prod-build-tfstate    | 

Your `state.tf` file should look like this:

```hcl
terraform {
  backend "s3" {
    bucket = "<bucket name for acct>"
    key    = "<app name>/<environment>/terraform.tfstate"
    region = "us-east-2"
  }
}
```

## Shared Resource State
Each AWS account has a set of shared resources maintained by the EACD-CloudOps team. The state for these resources has outputs that you can load in your own TF modules, as illustrated by the [Example Terraform Module](./example-tf.md) article.

The bucket name & region is the same as your account state bucket. Here are the S3 keys:

| Account        | S3 Object Key                                    | 
|----------------|--------------------------------------------------| 
| DMA Sandbox    | *Not available*                                  | 
| DMA Nonprod    | `dma-shared-resources/nonprod/terraform.tfstate` | 
| DMA Production | `dma-shared-resources/prod/terraform.tfstate`    | 
| ADO Sandbox    | `as-ado-sbx-resources/sandbox/terraform.tfstate` | 
| ADO Nonprod    | `ado-shared-resources/nonprod/terraform.tfstate` | 
| ADO Production | `ado-shared-resources/prod/terraform.tfstate`    | 

If you want to review the available outputs, the easiest way is to look at the output stage on the Jenkins job. The jobs that build shared resources are in the CloudOps folder -> *DeptName* Shared Resources.