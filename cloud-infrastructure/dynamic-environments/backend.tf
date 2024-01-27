terraform {
  backend "gcs" {
    bucket  = "jetrr-vision-terrafrom-backend"
    prefix  = "terraform/dynamic-environments/state"
  }
}