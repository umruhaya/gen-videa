# Gen Videa

## Project Overview

This monorepo contains various components of our application, including CI/CD workflows, AI notebooks, client-side web application, and server-side application. The architecture is primarily based on Google Cloud services.

## Repository Structure

- **.github/workflows**: Contains all CI/CD pipeline workflows for GitHub Actions. [Link to GitHub Actions](/.github/workflows/)

- **AI Notebooks**: Includes notebooks with code for the AI part of our application. These can be run on Google's free T4 GPU for tuning and sharing research results.

- **webclient**: A SvelteKit app for the client-side web application. [Learn Svelte](https://learn.svelte.dev/)

- **webserver**: Houses the FastAPI-based webserver, an integral part of the backend but not its entirety. This directory focuses on clean, minimal logic on the client-side, with most business logic on the server. [FastAPI Documentation](https://fastapi.tiangolo.com/)

- **business modules**: Contains various business logic modules. Integration is achieved using PubSub.

- **Training Images**: Includes Docker files and training scripts. This is primarily for internal use and runs on Google Kubernetes Engine.

- **Event Streaming Service**: A service deployed on Google Kubernetes Engine, streaming events from Kubernetes to a PubSub topic.

## Contribution Guide

Contributions are welcome in several areas of the project, primarily in AI notebooks, webclient, and webserver.

### Working with Git

- **Creating a Feature Branch**: Always create a new branch for your features.
- **Making a Pull Request**: After completing your work, raise a pull request to merge your branch into the main branch.
- **Branch Management**: Delete your branch after merging. If reopening the same branch, ensure it is synced with the main branch.

## Development Setup

- **AI Notebooks**: Use a Free T4 GPU with google collabs 
- **Webclient**: _under working - refer to its own README.md for now_
- **Webserver**: _under working - refer to its own README.md for now_

## Documentation

- **Swagger UI API**: The FastAPI backend automatically generates documentation using Swagger UI API.

## Infrastructure

- The entire architecture is built on Google Cloud, utilizing services like Google Kubernetes Engine and PubSub.

## Getting Started

1. Clone the repositiory (if you havent):
```bash
git clone <the-current-repo-link-here>
```

or just simply pull changes to sync your local working directory with the remote repository
```bash
git pull
```

2. Decide the Module that you want to work on. For instance, if you want to work on the web app `cd web-client`.

3. Before making any changes, make sure to create a new branch: `git checkout -b your-branch-name`. You can always check your current branch by running `git log`. checkout is a command used to move between different branches and commits.

4. Work on the selected feature, make sure to add only the files that you have changed using `git add`, and properly write commit message that describes what changes you have made.

5. Now, we want to Push Our changes to a remote repository. Run `git push origin <your-branch-name>`. In the terminal you would be able to see a link where you can raise a **Pull Request (PR)** Raise the PR and notify the repo maintainers.

## Support

For any queries or support, please contact `25100029@lums.edu.pk`
