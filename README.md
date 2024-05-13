# CPC Enicarthage Problem-Solving Platform

Welcome to the CPC Enicarthage Problem-Solving Platform! This website is designed to provide CPC Enicarthage members with a comprehensive platform to enhance their problem-solving skills and prepare for upcoming competitions.

## Overview

Our platform offers a range of features aimed at facilitating a conducive environment for learning and practicing problem-solving techniques. Here's what you can expect:

### Features

1. **Problem Repository**: Access a wide range of problems categorized by difficulty level and topic. Whether you're a beginner or an advanced problem-solver, there's something for everyone.

2. **Scoring System and Leaderboard**: Engage with our scoring system to track your progress and compete with fellow members. Our leaderboard showcases the top performers, providing motivation and recognition.

3. **Solution Submission**: Members can submit their solutions directly through the platform. Additionally, you can explore solutions submitted by other users, fostering collaboration and learning from peers.

4. **Online Code Editor**: Seamlessly write, compile, and execute code within our platform using our integrated online code editor. No need for external tools – everything you need is right here.

## Technologies

To deliver a robust and efficient platform, we utilize the following technologies:

- **React**
- **Node.js**
- **Express**
- **Postgres SQL**
- **Redis**
- **Judge0 API**

## Installation Guide


1. **Clone the Repository**
2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies.
``` bash
# Install server dependencies 
npm run server-install

# Install client dependencies 
npm run client-install

# Install concurrently
npm install
```
3. **Set Up Environment**: Configure the environment variables required for database connections, API integrations, etc.

``` bash
# Enviroment variables template : 
Server_PORT = 5000
DB_NAME = My_DB
DB_USER = USER
DB_PASS = PASS
SECRET_SESSION = SESSION_KEY
CLIENT_URL = "http://localhost:5173"
# Redis host domain and port
REDIS_HOST = "localhost"
REDIS_PORT = 6379
#Judge0 api url
JUDGE_URL = "http://localhost:2358/"
```
4. **Run the Application**
``` bash
# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client
```

## Collaborators

- [Yassine Ben Abdelaziz](https://github.com/YassineBenAbdelaziz)
- [Mohamed Rami Jebali](https://github.com/jebalirami7)
