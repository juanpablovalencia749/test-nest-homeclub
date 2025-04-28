/\*\*

# API Documentation

## Overview

This project contains two modules within the same API:

1. **Main Apartments Module**: Located in the `src/apartments` directory.

- **Purpose**: Manages apartment-related operations such as creating, updating, and retrieving apartment data.
- **Endpoint**: Accessible at `/api/apartments`.

2. **Apartments Extra Module**: Located in the `src/apartments-extra` directory.

- **Purpose**: Provides additional features and extended functionalities for apartment management.
- **Endpoint**: Accessible at `/api/apartments-extra`.

## Prerequisites

- **Node.js**: Ensure you have Node.js version 22 or higher installed.
- **Docker**: Docker must be installed and running on your system to use the Docker setup.

## Running the API

### Running Locally

1. Navigate to the project root directory.
2. Install dependencies:

```bash
npm install
```

3. Start the API:

```bash
npm run start:dev
```

### Running with Docker Compose

1. Start the server and populate the database with test data:

```bash
docker compose up -d
```

## Additional Notes

- Ensure that the `.env` file is properly configured before running the API.
- For development, you can use `npm run dev` to enable hot-reloading.
- Refer to the `README.md` files in the module directories for more specific details about endpoints and configurations.
