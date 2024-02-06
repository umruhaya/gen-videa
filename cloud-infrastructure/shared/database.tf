resource "google_sql_database_instance" "postgres_instance" {
  name             = "postgres-instance-genvidea-default"
  database_version = "POSTGRES_13"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = false
    }

    ip_configuration {
      ipv4_enabled    = true
    }
  }
}

resource "google_sql_database" "development" {
  name     = "development"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_database" "staging" {
  name     = "staging"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_database" "production" {
  name     = "production"
  instance = google_sql_database_instance.postgres_instance.name
}

resource "google_sql_user" "default" {
  name     = local.db_credentials["DB_USER"]
  instance = google_sql_database_instance.postgres_instance.name
  password = local.db_credentials["DB_PASS"]
}