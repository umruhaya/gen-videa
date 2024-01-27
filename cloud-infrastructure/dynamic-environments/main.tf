resource "google_pubsub_topic" "example" {
  name = "your-topic-name-${terraform.workspace}"
}

resource "google_pubsub_subscription" "example" {
  name  = "your-subscription-name-${terraform.workspace}"
  topic = google_pubsub_topic.example.name
}