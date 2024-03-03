# Requires Role `Project IAM Admin` to create this resources 

# Grant the service account Storage Admin role for full access to storage buckets
resource "google_project_iam_binding" "storage_admin" {
  project = data.google_project.project.project_id
  role    = "roles/storage.admin"

  members = [
    "serviceAccount:${google_service_account.app_data_sa.email}",
  ]
}

# Grant the service account Pub/Sub Editor role for publishing and consuming messages
resource "google_project_iam_binding" "pubsub_editor" {
  project = data.google_project.project.project_id
  role    = "roles/pubsub.editor"

  members = [
    "serviceAccount:${google_service_account.app_data_sa.email}",
  ]
}

resource "google_project_iam_binding" "cloudsql_editor" {
  project = data.google_project.project.project_id
  role    = "roles/cloudsql.editor"

  members = [
    "serviceAccount:${google_service_account.app_data_sa.email}",
  ]
}