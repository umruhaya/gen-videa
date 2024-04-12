output "instance_connection_name" {
  value = google_sql_database_instance.postgres_instance.connection_name
}

output "instance_public_ip" {
  value = google_sql_database_instance.postgres_instance.public_ip_address
}