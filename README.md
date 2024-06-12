# filej0ker

## Overview

This project is a peer-to-peer (P2P) file-sharing system that enables users to share files directly between their devices. The system includes an Express.js backend for signaling and authentication and uses WebRTC for direct file transfers between clients. 

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Real-Time Signaling**: WebSocket-based signaling for establishing P2P connections.
- **Direct File Transfer**: Peer-to-peer file transfer using WebRTC.
- **Privacy**: Optional use of TURN servers to hide IP addresses and facilitate connections.

## Architecture

- **Backend**: Express.js server for authentication, session management, and signaling.
- **Database**: PostgreSQL to store user data. Redis as a session manager.
- **Clients**: For now, the planned client will be a simple ReactJS web app.
- **WebRTC**: Technology for direct peer-to-peer file transfer.

## Getting Started

### Prerequisites

- Docker

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/andremmsilva/filej0ker.git
   cd filej0ker
   ```

2. **Set Environment Variables**

   Create a `.env` file in the root directory and add the following variables (feel free to change the values):

   ```JS
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_secret
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   ```

4. **Use Docker Compose to build the containers you need**

   ```bash
   docker-compose -f docker-compose.dev.yml build
   ```

5. **Run the containers**

   ```bash
   docker-compose -f docker-compose.dev.yml up [--watch]
   ```

5. **Open the Client**

   TODO

## Usage

1. **Register and Login**
   - Open the client in your web browser.
   - Register a new account or log in with an existing account.

2. **Search for Users**
   - Use the search functionality to find other online users.

3. **Send a File**
   - Select a user from the search results.
   - Choose a file to send and initiate the transfer.
   - The recipient will be prompted to accept or deny the file transfer.

4. **Receive a File**
   - Accept the incoming file transfer request to start receiving the file.

## Project Structure

```
TODO
```

## Technologies Used

- **Express.js**: Backend framework
- **WebRTC**: Peer-to-peer file transfer
- **JWT**: JSON Web Tokens for authentication
- **PostgreSQL**: Database for storing user information
- **Docker**: Containerizing all the parts of the app, optimizing the development and deployment workflows.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE 3. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [WebRTC](https://webrtc.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
