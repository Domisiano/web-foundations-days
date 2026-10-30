# Day 8 Reflection

The most difficult concept in this course was understanding how separate parts of a system work together, especially how concurrency affects data correctness. At first, checking whether a seat was available seemed sufficient. I learned that two requests can read the same available seat before either one writes, creating a race condition. I overcame this by connecting the concepts of transactions, row locking, unique constraints, and idempotency to a practical ticket-purchase example. Drawing the request flow also helped me understand why the database, rather than the interface or cache, must make the final allocation decision.

I do not have specific written presentation feedback recorded in my course notes, so I will not attribute comments to an audience that I cannot verify. Based on a self-review of my QuickNotes capstone, I would improve the architecture explanation by making every component's purpose, the traffic assumptions, and the reason for each scaling decision easier to follow. I would also demonstrate an error case and show the API request flow more clearly during a presentation.

Next, I will learn to build a real backend with Node.js and Express, connect it to PostgreSQL, and write automated tests for API endpoints and concurrent seat reservations. This will help me move from designing reliable systems to implementing and testing them.
