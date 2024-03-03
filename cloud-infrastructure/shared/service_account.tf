resource "google_service_account" "app_data_sa" {
  account_id   = "app-data"
  display_name = "Data Management Service Account"
}