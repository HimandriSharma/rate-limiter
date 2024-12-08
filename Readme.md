# Custom Redis Rate Limiter
This project implements a custom rate limiter using Redis to track and control incoming requests. The rate limiter ensures that users do not exceed a predefined number of requests within a specified time window.

## Features
- Customizable Rate Limits: Configure request limits and time windows.
- Redis Integration: Uses Redis as a fast, in-memory datastore for request logs.
- Express Middleware: Easily integrates into any Express.js application.
- Scalable: Designed to work efficiently in distributed systems.

## Prerequisites
- Docker: Ensure Docker is installed and running on your machine.
- Node.js: Optional, if you want to run the server locally without Docker.
- Redis: No manual setup required, as Redis runs in a Docker container.

## Setup
1. Clone the Repository

``` bash
git clone <repository_url>
cd custom-redis-rate-limiter
```
2. Install Dependencies (Optional) If you plan to run the project without Docker:
```
yarn install
```


## Running the Application
### Using Docker Compose
1. Build and start the application:

```bash
docker compose up --build
```
2. The server will start on http://localhost:4000.

### Running Locally Without Docker
1. Start a Redis server on your system (or use a hosted Redis instance).
2. Start the application:

```bash
yarn start
```
3. The server will run on http://localhost:4000.