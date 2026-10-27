# Library Books API Design

## Overview

This REST-style API manages a library's book resources. The resource collection is `/books`; an individual book is identified by its ID. The HTTP method describes the action, while the path identifies the resource.

For JSON request bodies, send the header `Content-Type: application/json`. Successful read and update responses use JSON unless the endpoint specifies `204 No Content`.

## Endpoints

### 1. List all books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Returns the books available in the library.
- **Example request body:** None; GET requests do not need a body.
- **Success status:** `200 OK`

### 2. Get one book

- **Method:** `GET`
- **Path:** `/books/42`
- **Description:** Returns the book whose ID is `42`.
- **Example request body:** None.
- **Success status:** `200 OK`

### 3. Create a book

- **Method:** `POST`
- **Path:** `/books`
- **Description:** Creates a new book and assigns it an ID.
- **Example request body:**

  ```json
  {
    "title": "The River Between",
    "author": "Ngũgĩ wa Thiong'o",
    "publishedYear": 1965,
    "isbn": "978-0435905484"
  }
  ```

- **Success status:** `201 Created`

### 4. Replace a book completely

- **Method:** `PUT`
- **Path:** `/books/42`
- **Description:** Replaces the stored representation of book `42` with the supplied representation.
- **Example request body:**

  ```json
  {
    "title": "The River Between",
    "author": "Ngũgĩ wa Thiong'o",
    "publishedYear": 1965,
    "isbn": "978-0435905484"
  }
  ```

- **Success status:** `200 OK`

### 5. Update part of a book

- **Method:** `PATCH`
- **Path:** `/books/42`
- **Description:** Updates only the supplied fields of book `42`; other fields remain unchanged.
- **Example request body:**

  ```json
  {
    "publishedYear": 1966
  }
  ```

- **Success status:** `200 OK`

### 6. Delete a book

- **Method:** `DELETE`
- **Path:** `/books/42`
- **Description:** Removes book `42` from the library.
- **Example request body:** None required.
- **Success status:** `204 No Content` (the deletion succeeded and the response has no body).

### 7. List books by author

- **Method:** `GET`
- **Path:** `/books?author=Ng%C5%A9g%C4%A9%20wa%20Thiong%27o`
- **Description:** Returns books matching the `author` query parameter. Query parameters follow `?`; multiple parameters can be joined with `&`.
- **Example request body:** None.
- **Success status:** `200 OK`

## Error responses

- **`400 Bad Request`:** The request is invalid. Example: creating a book with a missing title or a year in an invalid format.
- **`404 Not Found`:** The requested resource does not exist. Example: requesting `GET /books/9999` when no book has ID `9999`, or requesting a path that the API does not support.

## Design notes

- Use plural resource nouns such as `/books`, not action-based paths such as `/getBooks` or `/deleteBook/42`.
- Use the HTTP method to express the operation: GET reads, POST creates, PUT replaces, PATCH partially updates, and DELETE removes.
- A specific book is addressed with its ID, for example `/books/42`.
- Each request should carry the information needed to process it; the API should not rely on hidden client-side state.
