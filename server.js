const express = require("express");
const app = express();

app.use(express.json());

// ---------------- LRU Cache ----------------
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

    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  insertFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;

    const node = this.map.get(key);
    this.remove(node);
    this.insertFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.remove(node);
      this.insertFront(node);
      return;
    }

    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }

    const node = new Node(key, value);
    this.insertFront(node);
    this.map.set(key, node);
  }
}

// cache with capacity = 2
const cache = new LRUCache(2);

// ---------------- REST APIs ----------------

// Insert (correct REST way)
app.post("/cache", (req, res) => {
  const { key, value } = req.body;
  cache.put(key, value);
  res.json({ message: "Inserted", key, value });
});

// Get value
app.get("/cache/:key", (req, res) => {
  const key = parseInt(req.params.key);
  const value = cache.get(key);

  if (value === -1) {
    return res.json({ error: "Key not found" });
  }

  res.json({ key, value });
});

// Health check
app.get("/status", (req, res) => {
  res.json({ status: "running" });
});

app.listen(3000, () => {
  console.log("LRU Cache API running on port 3000");
});
