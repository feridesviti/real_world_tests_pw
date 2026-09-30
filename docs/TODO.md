# TODO — what is still to be done

Status today: 30 automated tests (UI, API, contract). Most of them check the happy path.
Negative, boundary and edge scenarios are the main gap. Priority scale: Critical > High > Medium > Low.

## 1. Negative scenarios

| Area         | Scenario                                                                     | Layer    | Priority |
| ------------ | ---------------------------------------------------------------------------- | -------- | -------- |
| Login        | Unknown email, empty fields, empty password only                             | UI       | High     |
| Login        | SQL-like text in password                                                    | UI + API | High     |
| Registration | Email or username already taken                                              | UI + API | High     |
| Registration | Empty fields, invalid email format, very short password                      | UI + API | High     |
| Settings     | Username or email already taken                                              | UI + API | High     |
| Settings     | Empty username, empty email, invalid email format                            | UI + API | High     |
| Settings     | Open `/settings` without login                                               | UI       | Critical |
| Article      | Create with empty title, description or body                                 | UI + API | High     |
| Article      | Edit or delete an article of another user (expect 403)                       | API      | Critical |
| Article      | Create, edit or delete without a token (expect 401)                          | API      | Critical |
| Comments     | Empty comment, delete a comment of another user                              | UI + API | High     |
| Favorites    | Favorite the same article twice, unfavorite an article that is not favorited | API      | Medium   |
| API          | Wrong or expired token on every protected endpoint                           | API      | High     |
| API          | Invalid JSON body (expect 422 or 400, not 500)                               | API      | Medium   |

## 2. Boundary scenarios

| Area          | Scenario                                                             | Layer    | Priority |
| ------------- | -------------------------------------------------------------------- | -------- | -------- |
| Articles list | `limit` = 0, 1, 20, 21, very large; `offset` beyond the last article | API      | Medium   |
| Articles list | Negative `limit` and `offset`                                        | API      | Low      |
| Password      | Length 1, minimum allowed, minimum − 1, very long                    | UI + API | Medium   |
| Article       | Title and body at the maximum allowed length and one over            | UI + API | Medium   |
| Bio           | 5000 characters                                                      | UI       | Low      |
| Tags          | Many tags, tag with spaces, tag with 100+ characters                 | API      | Low      |

## 3. Edge scenarios

| Area        | Scenario                                                                           | Layer    | Priority |
| ----------- | ---------------------------------------------------------------------------------- | -------- | -------- |
| Text fields | Unicode, emoji, letters with accents                                               | UI + API | Low      |
| Text fields | HTML and `<script>` in bio, article body and comment (must be shown as plain text) | UI       | High     |
| Login       | Email in upper case, email with spaces around                                      | UI       | Low      |
| Session     | Back button after logout, two tabs with different users                            | UI       | Medium   |
| Concurrency | Two updates of the same settings at the same time                                  | API      | Low      |
| Pictures    | Invalid or broken picture URL                                                      | UI       | Medium   |

## 4. Missing areas (no tests yet)

| Area         | What to cover                                              | Priority |
| ------------ | ---------------------------------------------------------- | -------- |
| Article edit | Change title, body, tags; check result on the article page | High     |
| Follow       | Follow and unfollow an author, "Your Feed" tab             | Medium   |
| Tags         | Click a tag in the sidebar, filter of the list             | Medium   |
| Pagination   | Go to page 2 in the UI, active page is marked              | Medium   |
| Filters API  | `tag`, `author`, `favorited`                               | Medium   |

## 5. Quality of the project

| #   | What                                                                                                                                                                           | Priority |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| 1   | Parallel runs are unstable: 3–6 tests of 30 fail with 2–3 workers (`check article comments` fails almost every time). CI runs with 1 worker. Find the cause: test or demo site | High     |
| 2   | Run the manual cases in `TEST_CASES.md` (the ones without `[auto]`) and record the real result                                                                                 | High     |
| 3   | Bug reports: write them in the format from the team template, only for bugs that were reproduced by hand                                                                       | Medium   |
| 4   | Add a status badge and a scheduled run in CI                                                                                                                                   | Low      |
| 5   | Accessibility checks (`@axe-core/playwright`) and a mobile viewport project                                                                                                    | Low      |
| 6   | Several themed commits instead of one big commit                                                                                                                               | Low      |
