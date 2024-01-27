resource "google_container_cluster" "genvidea_cluster" {
  provider = google-beta
  name     = "genvidea-cluster"
  location = "us-central1-f"

  # network    = google_compute_network.private_network.name
  # subnetwork = google_compute_subnetwork.gke_subnetwork.name

  /**
    It is recommended that node pools be created and managed as separate resources as in the example above.
    This allows node pools to be added and removed without recreating the cluster. 
    Node pools defined directly in the google_container_cluster resource cannot be removed without re-creating the cluster.
  */
  initial_node_count       = 1
  remove_default_node_pool = true
  # deletion_protection      = true # set to false only when you want to delete the cluster

  cluster_autoscaling {
    enabled = true
    # Profile defaults to "BALANCED"
    autoscaling_profile = "OPTIMIZE_UTILIZATION"

    resource_limits {
      resource_type = "cpu"
      minimum       = 1
      maximum       = 8192
    }

    resource_limits {
      resource_type = "memory"
      minimum       = 1024  # Specify the minimum amount of memory in MB
      maximum       = 1048576 # 1 TB
    }
  }

  node_config {
    # Enable Image Streaming (https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs/resources/container_cluster#gcfs_config)
    gcfs_config {
      enabled = true
    }
  }
}

# CPU Pool for general purpose workloads + Image Cache
resource "google_container_node_pool" "general_node_pool" {
  name       = "general-node-pool"
  location   = "us-central1-f"
  cluster    = google_container_cluster.genvidea_cluster.name
  node_count = 0

  node_config {
    machine_type = "e2-standard-2"

    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.full_control",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
    ]

    gcfs_config {
      enabled = true
    }
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  autoscaling {
    total_min_node_count = 1
    total_max_node_count = 10
  }

  lifecycle {
    ignore_changes = [
      node_config,
      // List other attributes causing replacement
    ]
  }
}

# GPU node pool
resource "google_container_node_pool" "t4_node_pool" {
  name       = "t4-gpu-node-pool"
  location   = "us-central1-f"
  cluster    = google_container_cluster.genvidea_cluster.name
  node_count = 0

  node_config {
    machine_type = "n1-standard-4"

    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.full_control",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append",
    ]

    guest_accelerator {
      type  = "nvidia-tesla-t4"
      count = 1
    }

    gcfs_config {
      enabled = true
    }
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  autoscaling {
    total_min_node_count = 0
    total_max_node_count = 10
  }
}