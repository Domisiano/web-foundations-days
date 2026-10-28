# Day 7 Assignment — Scaling SnapShare

## 1. Assumptions
- 10,000,000 registered users; 10% active daily.
- Each daily active user uploads one original photo and views 50 feed pages per day.
- Each original photo is 2 MB and each thumbnail is 50 KB (decimal units).
- Use 100,000 seconds/day for average rate estimates and 5× average for peak traffic.
- Each upload stores one original and one thumbnail. Replication, backups, metadata and temporary files are excluded from base storage.

## 2. Load and storage estimates

**Daily active users:** 10,000,000 × 10% = **1,000,000 DAU**.

**Uploads:** 1,000,000 DAU × 1 photo/day = 1,000,000 uploads/day. Average = 1,000,000 ÷ 100,000 ≈ **10 uploads/s**. Peak = 10 × 5 = **50 uploads/s**.

**Feed views:** 1,000,000 DAU × 50 views/day = 50,000,000 feed views/day. Average = 50,000,000 ÷ 100,000 ≈ **500 feed views/s**. Peak = 500 × 5 = **2,500 feed views/s**.

**Original-photo storage:** 1,000,000 × 2 MB = 2 TB/day; 2 TB × 365 = **730 TB/year**.

**Thumbnail storage:** 1,000,000 × 50 KB = 50 GB/day; 50 GB × 365 = **18.25 TB/year**.

**Combined new storage:** 730 TB + 18.25 TB = **748.25 TB/year**, before replication, backups, metadata and overhead.

| Measure | Average | Estimated peak (5×) |
|---|---:|---:|
| Photo uploads | 10/s | 50/s |
| Feed page views | 500/s | 2,500/s |

These are rough planning estimates, not capacity guarantees. Validate against real traffic, feed fan-out, photo sizes, cache hit rate and burst patterns.

## 3. Read-heavy or write-heavy?
SnapShare is **read-heavy** at the request level: each active user views 50 feed pages for each photo uploaded. The feed path should be optimized with caching, read replicas for eligible metadata queries, and a CDN for images. Upload processing must still absorb bursts reliably.

## 4. Photo storage choice
Store original photos and thumbnails in **object storage**, not as large binary values inside the relational database. Object storage is designed for durable files and scales independently. The database stores metadata, ownership, timestamps, access relationships and object keys. Use authorization checks and short-lived signed URLs for private photos.

## 5. Architecture diagram

```text
                         +----------------------+
                         | DNS: snapshare.example|
                         +----------+-----------+
                                    |
                                    v
+----------------+       +----------------------+       +------------------+
| Browser/mobile |------>| CDN / edge cache     |------>| Object storage   |
| client         | image | originals/thumbnails | miss  | photo files      |
+-------+--------+       +----------------------+       +------------------+
        | API requests (HTTPS/JSON)
        v
+----------------------+
| Load balancer        |
| health checks        |
+-----+-----------+----+
      |           |
      v           v
+-----------+ +-----------+       +-------------------+
| App       | | App       |------>| Cache (Redis)     |
| server 1  | | server 2  |       | feed/metadata     |
+-----+-----+ +-----+-----+       +-------------------+
      | writes      | reads              ^ cache miss
      v             v                    |
+----------------+  +----------------+---+
| Primary DB     |->| Read replica(s)|
| users, posts,  |  | feed metadata  |
| photo metadata |  +----------------+
+----------------+
      | enqueue thumbnail job
      v
+--------------------+       +----------------------+
| Message queue      |------>| Thumbnail worker(s)  |
+--------------------+       +----------+-----------+
                                        |
                                        v
                              +----------------------+
                              | Object storage       |
                              | thumbnail object     |
                              +----------------------+
```

## 6. Component responsibilities
- **DNS:** Resolves the hostname to the service entry point.
- **CDN:** Serves cached images from nearby edge locations, reducing latency and origin traffic.
- **Load balancer:** Distributes API requests among healthy application servers.
- **Stateless app servers:** Handle API logic and scale horizontally without relying on one server's memory.
- **Redis cache:** Speeds repeated feed/metadata reads; TTL and invalidation rules reduce stale results.
- **Primary database:** Stores authoritative structured records and accepts writes.
- **Read replicas:** Handle eligible read queries and reduce primary database load; replication lag may briefly expose stale data.
- **Object storage:** Durably stores original and thumbnail files separately from relational records.
- **Message queue:** Buffers thumbnail jobs and decouples image processing from API responses.
- **Thumbnail workers:** Resize/encode images and save thumbnail objects asynchronously.
- **Health checks and monitoring:** Detect failures and track latency, error rate, queue depth, cache hit rate and storage growth.

## 7. Upload flow
1. Client authenticates and requests permission to upload.
2. API validates authorization, file type, size limits and rate limits.
3. API creates a photo metadata record with status `pending` and prepares an object key or short-lived signed upload URL.
4. Client uploads the original to object storage (directly using a signed URL where appropriate).
5. Backend verifies upload completion and finalizes the metadata record.
6. Backend enqueues a thumbnail-generation job and responds without waiting for resizing.
7. A worker consumes the job, reads the original, creates a thumbnail and stores it in object storage.
8. Worker marks the photo `ready` and records the thumbnail key. Failed jobs retry with back-off and eventually enter a dead-letter queue.
9. Feed APIs return authorized metadata and image URLs; the CDN serves image bytes. Versioned keys or invalidation avoid stale images.

Queue processing should be idempotent so retries do not corrupt completed photo records.

## 8. Trade-offs
1. **Cache speed vs freshness:** Redis/CDN reduce latency and load but can serve stale data; use TTLs, targeted invalidation and versioned image keys.
2. **Asynchronous thumbnails vs immediate completeness:** Fast API responses and burst absorption come at the cost of a temporary processing placeholder.
3. **Read capacity vs consistency:** Replicas improve read capacity, but lag may briefly hide a new upload; route read-after-write requests to the primary when needed.
4. **Reliability vs cost:** Multiple app servers, replicas and backups improve resilience but increase operating cost.
5. **Direct object upload vs simplicity:** Signed uploads reduce app-server bandwidth but require careful expiry, object-key scoping and completion validation.

## 9. Reliability and observability
- Run at least two app instances behind health-checked load balancing.
- Back up metadata and define object-storage versioning and retention policies.
- Set timeouts, bounded retries with exponential back-off, upload limits and per-user rate limits.
- Monitor p95/p99 latency, API errors, upload failures, cache hit rate, queue age/depth, thumbnail duration, replica lag and storage growth.
- Protect private images with authorization and short-lived signed URLs.

## 10. Summary
At 1 million DAU, SnapShare is estimated at 10 average uploads/s (50 peak) and 500 average feed views/s (2,500 peak). Originals add about 730 TB/year and thumbnails 18.25 TB/year: **748.25 TB/year combined** before redundancy and overhead. CDN, object storage, stateless app servers, load balancing, caching, database replicas and queued thumbnail workers address the major scaling needs.
