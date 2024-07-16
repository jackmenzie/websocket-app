# Websocket App

## Project Overview

This project is designed to monitor and observe server metrics in a given region utilising WebSockets. The metrics cover various aspects of server performance, including worker details, server stats, and service availability. The backend server is built using Fastify, while the frontend client is built using React.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

1. Clone the repository:

```sh
git clone REPOSITORY_URL
cd REPOSITORY_DIRECTORY
```

2. Install dependencies (pnpm used):

```sh
pnpm install
```

3. Start the server:

```sh
pnpm run dev:server
```

4. Start the server:

```sh
pnpm run dev:client
```

## Usage

Once the server and client are running, you can access the client interface in your web browser to view the server metrics. The client will display real-time data fetched from the backend server.
