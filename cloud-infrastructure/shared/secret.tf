data "google_secret_manager_secret_version" "db_credentials" {
  provider = google
  secret   = "db_credentials_default"
  version  = "latest"
}

locals {
  db_credentials = jsondecode(data.google_secret_manager_secret_version.db_credentials.secret_data)
}