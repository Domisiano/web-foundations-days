# Day 5 Assignment — User Directory and Library API

## Files
- `day5/index.html`: user-directory interface with required IDs and deferred script loading.
- `day5/users.js`: fetches users, checks `response.ok`, renders with DOM APIs and `textContent`, handles loading/error/success, and filters locally without another request.
- `day5/style.css`: responsive presentation (additional styling file).
- `day5/library-api.md`: seven REST endpoints plus 400 and 404 error examples.

## Run
Open `day5/index.html` in a browser while connected to the internet. Click **Load users**. JSONPlaceholder is a practice API and the directory uses its public `/users` endpoint.

## Required manual checks
1. Click **Load users**: expect 10 users and a success message.
2. Search `lea` or `LEA`: results should match regardless of case; the Network panel should show no additional users request while typing.
3. Search a name that does not exist: expect `No users match your filter.`
4. Temporarily change `API_URL` in `users.js` to `https://jsonplaceholder.typicode.com/usersXYZ`; click Load users and confirm a friendly error message. Restore the correct URL afterward.
5. Use browser DevTools → Network to verify the GET request and its response.

## Git
Copy the `day5` folder into the root of the existing `web-foundations-days` repository. Then run:
```bash
git add day5
git commit -m "Day 5 assignment"
git push
```
