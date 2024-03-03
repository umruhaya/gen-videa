resource "google_pubsub_topic_iam_member" "publisher" {
  topic = google_pubsub_topic.file_upload.name
  role  = "roles/pubsub.publisher"
  member = "serviceAccount:service-${data.google_project.project.number}@gs-project-accounts.iam.gserviceaccount.com"
}

resource "google_pubsub_topic" "file_upload" {
  name = "genvidea-file-uploaded-to-storage-${terraform.workspace}"
}

resource "google_pubsub_topic" "file_upload_dead_letter" {
  name = "file_upload-dead-letter-topic-${terraform.workspace}"
}

resource "google_pubsub_subscription" "file_upload_sub" {
  name  = "genvidea-file-uploaded-${terraform.workspace}"
  topic = google_pubsub_topic.file_upload.name

  push_config {
    push_endpoint = "https://web.genvidea.com/api/webhook/file-uploaded"
    // Optionally, you can add attributes like authentication credentials
    // attribute {
    //   key   = "x-goog-version"
    //   value = "v1"
    // }
  }
  
  dead_letter_policy {
    dead_letter_topic = google_pubsub_topic.file_upload_dead_letter.id
    max_delivery_attempts = 5
  }

  ack_deadline_seconds = 20
}