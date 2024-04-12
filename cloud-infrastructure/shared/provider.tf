provider "google" {
  project = var.gcp_project_id
  region  = "us-central1"
}

provider "google-beta" {
  project = var.gcp_project_id
  region  = "us-central1"
}