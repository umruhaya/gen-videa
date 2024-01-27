provider "google" {
  credentials = file(var.credentials_file)
  project     = "jetrr-vision"
  region      = "us-central1"
}

provider "google-beta" {
  credentials = file(var.credentials_file)
  project     = "jetrr-vision"
  region      = "us-central1"
}