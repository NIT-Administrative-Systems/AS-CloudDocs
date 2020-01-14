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