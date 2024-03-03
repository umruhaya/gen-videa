resource "google_storage_bucket" "upload_bucket" {
  name          = "genvidea-uploads-${terraform.workspace}"
  location      = "us-central1"
  force_destroy = true
}

resource "google_storage_notification" "bucket_notification" {
  bucket         = google_storage_bucket.upload_bucket.name
  topic          = google_pubsub_topic.file_upload.id
  payload_format = "JSON_API_V1"

  event_types = [
    "OBJECT_FINALIZE",
  ]

  object_name_prefix = "uploads/"
}