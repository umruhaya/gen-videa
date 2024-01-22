# FastAPI Web Server

## Overview
This FastAPI-based web server is a critical component of the backend infrastructure, serving as the primary interface for client interactions. It is designed to be lightweight, delegating resource-intensive tasks to other components within the architecture.

## Architecture
- **Lightweight Server**: The web server should not handle heavy processing. All such tasks must be offloaded to other components.
- **Event-Driven Microservices**: We utilize `PubSub` to facilitate an event-driven microservices architecture. The backend will function both as a Publisher and a Subscriber.
- **Task Creation**: To initiate a task for another service, the backend can either make a direct API call or publish a PubSub message.
- **PubSub Webhook**: PubSub events are consumed by the backend via the `/webhook` router, which uses a PubSub HTTP subscription.

## Directory Structure
```
app/
├── models/             # SQL models using SQLAlchemy
├── utils/              # Helper functions and utilities
├── routers/            # API routers
│   └── webhook/        # Router for PubSub webhook (HTTP push subscription)
├── main.py             # Entrypoint of the application
├── dependencies.py     # Dependency injection and related utilities
requirements.txt        # Project dependencies
Dockerfile              # Docker configuration for containerization
```

## Local Development
Developers can run the application locally using the following command:
```
uvicorn app.main:app --reload
```
This command starts the server with hot-reload enabled, allowing for real-time updates during development.

## Docker Development Environment
To test changes within a Docker container, use:
```
docker compose up -d
```
This command starts a development environment in Docker. File changes are synchronized in watch mode. Note that modifications to `requirements.txt` will require the Docker image to be rebuilt. Docker Compose version 2.22 or later is required to use the Compose Watch feature, as detailed in the [Docker documentation](https://docs.docker.com/compose/file-watch/).

## Contributing
Please adhere to the following guidelines when contributing to the project:
- Develop features on a separate branch.
- Always submit a Pull Request (PR) for merging your changes into the main branch.