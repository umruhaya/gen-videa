terraform {
  backend "gcs" {
    bucket = "jetrr-vision-terrafrom-backend"
    prefix = "terraform/shared-environment/state"
  }
}