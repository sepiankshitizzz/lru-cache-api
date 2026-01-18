const express = require("express");
const app = express();

app.use(express.json());

// ================= LRU Cache =================
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();

    // Dummy head & tail
    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  insertAtFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return null;

    const node = this.map.get(key);
    this.remove(node);
    this.insertAtFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.remove(node);
      this.insertAtFront(node);
      return;
    }

    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }

    const node = new Node(key, value);
    this.insertAtFront(node);
    this.map.set(key, node);
  }
}

// ================= Cache Instance =================
const cache = new LRUCache(2);

// ================= REST APIs =================

// Root (optional but nice)
app.get("/", (req, res) => {
  res.send("LRU Cache API is running");
});

// Insert into cache
app.post("/cache", (req, res) => {
  const { key, value } = req.body;

  if (key === undefined || value === undefined) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  cache.put(Number(key), value);
  res.json({ message: "Inserted", key, value });
});

// Get from cache
app.get("/cache/:key", (req, res) => {
  const key = Number(req.params.key);
  const value = cache.get(key);

  if (value === null) {
    return res.status(404).json({ error: "Key not found" });
  }

  res.json({ key, value });
});

// Health check
app.get("/status", (req, res) => {
  res.json({ status: "running" });
});

// ================= Server =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`LRU Cache API running on port ${PORT}`);
});
