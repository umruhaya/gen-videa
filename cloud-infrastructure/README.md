# Terraform for Google Cloud

This repository contains Terraform configurations for managing infrastructure on Google Cloud Platform (GCP). Terraform is an Infrastructure as Code (IaC) tool that allows you to define your cloud resources in human-readable configuration files that can be versioned, reused, and shared.

## Enable APIs

```bash
gcloud auth login
gcloud config set project [project-name]
gcloud services enable dns.googleapis.com
gcloud services enable servicenetworking.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable pubsub.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable servicenetworking.googleapis.com
```

## Directory Structure

```bash
cloud-infrastructure/
├── dynamic-environments/   # Contains Terraform files for specific workspaces like dev, stag, and prod.
│   ├── backend.tf          # Configuration for the Terraform backend specific to dynamic environments.
│   ├── main.tf             # The primary configuration file for resources in dynamic environments.
│   ├── output.tf           # Specifies output values for dynamic environments.
│   ├── provider.tf         # Configures the provider for Terraform in dynamic environments.
│   ├── variable.tf         # Declares variables used in dynamic environments.
│   └── version.tf          # Sets the Terraform version and provider versions for dynamic environments.
├── shared/                 # Contains Terraform files that apply to the default workspace.
│   ├── backend.tf          # Shared backend configuration for Terraform.
│   ├── database.tf         # Terraform configuration for databases in the shared environment.
│   ├── kubernetes.tf       # Terraform configuration for Kubernetes in the shared environment.
│   ├── output.tf           # Specifies shared output values.
│   ├── provider.tf         # Configures the provider for Terraform in the shared environment.
│   ├── secret.tf           # Terraform configuration for managing secrets in the shared environment.
│   ├── variable.tf         # Declares variables used in the shared environment.
│   └── version.tf          # Sets the Terraform version and provider versions for the shared environment.
├── README.md               # Documentation for the cloud-infrastructure project.
└── workflow.yml            # CI/CD pipeline configuration.
```

## Variables

you can provide variables like this:

```bash
terraform plan -var "credentials_file=$GOOGLE_APPLICATION_CREDENTIALS"

# if state gets locked
terraform force-unlock -force LOCK_ID
```

## Workspaces

Terraform Workspaces are a convenient way to manage resources for different environment like (dev, staging, production):

if you are running this code for the first time on a new gcp project. make sure to create the following workspaces:

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new production
```

## Prerequisites

Before you begin, ensure you have the following prerequisites installed and configured:

- [Terraform](https://www.terraform.io/downloads.html) (version requirements should be specified)
- [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install) for authentication
- A Google Cloud Platform account with billing enabled
- Necessary permissions to create and manage GCP resources

## Authentication

Terraform requires authentication credentials to manage resources on Google Cloud. You can authenticate Terraform to Google Cloud in several ways:

1. Using a Service Account (recommended): Create a service account in your GCP project and download the JSON key file.

2. Using your personal Google account by running `gcloud auth application-default login`.

Refer to the [Terraform Provider for Google Cloud documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/provider_reference#authentication) for detailed authentication options and instructions.

_we are using the recommended(service account) approach in this case_

## Usage

To use these Terraform configurations, follow these steps:

1. **Set up your environment:**

   Set the environment variable for the Google Cloud project ID:

   ```sh
   export GOOGLE_PROJECT="your-gcp-project-id"
   ```

   If you are using a service account, set the path to the service account key file:

   ```sh
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
   ```

2. **Initialize Terraform:**

   Initialize the Terraform environment to install necessary plugins and prepare the configuration:

   ```sh
   terraform init
   ```

3. **Create a Terraform plan:**

   Review the changes Terraform will make to your infrastructure based on the configuration files:

   ```sh
   terraform plan
   ```

4. **Apply the Terraform configuration:**

   Apply the Terraform configuration to create or update your infrastructure:

   ```sh
   terraform apply
   ```

   Confirm the action when prompted.

5. **Inspect the state:**

   After applying the configuration, you can inspect the current state of your resources:

   ```sh
```sh
   terraform show
   ```

6. **Make changes:**

   To update your infrastructure, modify the Terraform configuration files and repeat steps 4 and 5 to plan and apply the changes.

7. **Destroy the infrastructure:**

   If you need to remove all the resources managed by Terraform, use the following command:

   ```sh
   terraform destroy
   ```

   Confirm the action when prompted to delete the resources.

## Configuring Backend

Terraform does not automatically create the backend bucket for you. We must manually create the Google Cloud Storage (GCS) bucket before you can use it as a backend for storing Terraform state.

Here are the steps you would typically follow:

1. **Create the GCS Bucket**: Use the Google Cloud Console, `gsutil`, or the Google Cloud SDK to create a new bucket. Make sure that the bucket name is globally unique and that it's in the correct project.

2. **Configure Permissions**: Ensure that the account or service account used by Terraform has the necessary permissions to read and write to the bucket. The minimum permissions required are usually `storage.objectAdmin` or a custom role with equivalent permissions.

3. **Configure Terraform Backend**: In your Terraform configuration, specify the GCS backend with the bucket you created.

```hcl
terraform {
  backend "gcs" {
    bucket  = "your-terraform-state-bucket"
    prefix  = "terraform/state"
  }
}
```

4. **Initialize Terraform**: Run `terraform init` to initialize the backend. Terraform will verify that it can access the GCS bucket and set up the environment to use it for state management.

If you run `terraform init` with a backend configuration that points to a non-existent GCS bucket, Terraform will produce an error indicating that the bucket does not exist.

It's important to create and manage the backend storage resources outside of Terraform to avoid a `chicken-and-egg` problem, where you would need the state storage to manage the resources, including the state storage itself.

## Managing Different Environments

Assume that we have different environments to manage like (dev, prod). When you run Terraform with a different set of variables (like changing `var.environment` from `dev` to `production`), Terraform sees that the resources defined in the state file with the `dev` suffix no longer match your configuration and plans to destroy them, then create new ones with the `production` suffix.

To handle multiple environments with Terraform, we typically have a few options but we would go with the _best one_ which is **workspaces**

### Workspaces

Terraform workspaces allow you to maintain separate state files for different environments. You can use the following commands to manage workspaces:

   ```sh
   terraform workspace new dev
   terraform workspace new production
   ```

   Then, before applying your Terraform configuration, you would select the appropriate workspace:

   ```sh
   terraform workspace select dev
   # or
   terraform workspace select production
   ```

   This way, Terraform maintains separate state files for each environment, and changing variables won't affect resources in other workspaces.

Here's an example of how you might use workspaces:

```sh
# Create a new workspace for 'dev' and 'production'
terraform workspace new dev
terraform workspace new production

# Make sure to select the correct workspace before applying
terraform workspace select dev
terraform apply -var 'environment=dev'

# When you want to work with production
terraform workspace select production
terraform apply -var 'environment=production'
```

Remember that each workspace has its own state, so resources created in one workspace will not be affected by actions taken in another workspace.

When using workspaces, you can also make the resource names workspace-aware without needing to pass the environment as a variable:

```hcl
resource "google_pubsub_topic" "example" {
  name = "your-topic-name-${terraform.workspace}"
}

resource "google_pubsub_subscription" "example" {
  name  = "your-subscription-name-${terraform.workspace}"
  topic = google_pubsub_topic.example.name
}
```

With this setup, the `${terraform.workspace}` will automatically use the name of the current workspace, so you don't have to pass `var.environment` explicitly.

## Best Practices

When using Terraform with Google Cloud, consider the following best practices:

- **Version Control:** Keep your Terraform configurations in version control to track changes and collaborate with team members.
- **Modular Design:** Organize your configurations into modules for reusability and maintainability.
- **Sensitive Data:** Avoid committing sensitive data like secrets or private keys to version control. Use environment variables or secret management tools instead.
- **State Management:** Use remote backends like Google Cloud Storage for Terraform state files to share state across a team and for reliability.
- **Review and Plan:** Always review the plan Terraform generates before applying changes to understand the impact on your infrastructure.


<!----------->