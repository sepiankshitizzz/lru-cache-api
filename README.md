# LRU Cache API

An in-memory LRU (Least Recently Used) cache implemented using
HashMap + Doubly Linked List and exposed via REST APIs.

## Features
- O(1) get and put operations
- LRU eviction policy
- REST API interface
- Tested using curl/Postman

## Tech Stack
- Node.js
- Express.js

## API Endpoints

### Insert value
POST /cache
```json
{
  "key": 1,
  "value": 100
}
