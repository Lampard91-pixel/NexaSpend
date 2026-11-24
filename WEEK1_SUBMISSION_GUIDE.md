# Week 1 Submission Guide

Use this guide to prepare and demonstrate the NexaSpend Week 1 Student Expense
Manager. Complete the manual checks and research fields yourself; this guide
does not claim that they have already been done.

## Test checklist and current test notes

### Automated checks actually run

Run the app tests from the project root:

```powershell
python -m unittest discover -s tests -v
```

Latest recorded result: **6 tests passed** using the test module's temporary
SQLite database.

- [x] Dashboard renders total income, expenses, balance, filter controls and
  chart data.
- [x] Income filter displays income records and excludes expenses.
- [x] Valid transaction can be added and persisted.
- [x] Invalid amount and invalid date are rejected.
- [x] Edit page renders and a transaction can be updated.
- [x] Existing transaction can be deleted; a different test transaction stays.
- [x] Missing transaction IDs return HTTP 404 for edit and delete.
- [x] Python files compile with `py_compile`.
- [x] `static/js/script.js` and `static/js/charts.js` pass `node --check`.
- [x] A mock Chart.js runtime harness confirmed that monthly and category chart
  data initialize and chart colors refresh when the theme changes. This was a
  mocked runtime check, not a visual browser test.

### Data integrity check actually run

- [x] Active `instance/expenses.db` returned `ok` for SQLite
  `PRAGMA integrity_check`.
- [x] The active database contained two transaction rows (IDs 3 and 4) at the
  time of the read-only check.
- [x] A SHA-256 comparison of the active transaction rows with
  `instance/expenses-backup-20261124-224825.db` matched exactly. The backup also
  returned `ok` for SQLite integrity.
- [x] These database checks were read-only. No database changes were made as
  part of the Week 1 cleanup.

### Manual checks to perform in a browser

- [ ] Start the app and confirm the dashboard loads without Flask errors.
- [ ] Add one income record and one expense; confirm totals and balance change
  as expected.
- [ ] Edit a test record and confirm the changed values appear on the dashboard.
- [ ] Delete a disposable test record and confirm the browser asks for
  confirmation first.
- [ ] Test All, Income and Expenses filters.
- [ ] Confirm the category chart changes with actual expense categories and the
  monthly chart reflects the records' dates.
- [ ] Switch dark/light themes, reload and verify the preference persists.
- [ ] At mobile width, open/close the navigation drawer using the menu button,
  close button, overlay and a navigation link.
- [ ] Check the add/edit forms and transaction table at desktop, tablet and
  mobile widths; note any overflow or clipped content.
- [ ] Check the browser console and Flask terminal for errors.

For manual CRUD checks against the real database, use non-sensitive sample
records and remove only those samples afterward. Do not delete the two existing
records. The automated test suite uses a separate temporary database.

### Known verification limits

- No real-browser or device-size visual test was run in this work session.
- The chart runtime check uses a mock Chart.js object; it does not prove that
  the external Chart.js CDN loads in the user's browser.
- No real email, authentication, user-isolation, budget, savings or export
  tests apply to the Week 1 scope.

## Screenshots to capture

Capture these from the running app with representative, non-sensitive data.
Avoid exposing private financial details, browser profiles or environment
variables.

- [ ] Desktop dashboard in dark theme, including summary cards and charts.
- [ ] Desktop dashboard in light theme.
- [ ] Recent transactions with the All filter selected.
- [ ] Recent transactions with Income selected.
- [ ] Recent transactions with Expenses selected.
- [ ] Add Transaction form showing its labeled fields.
- [ ] Edit Transaction form with a disposable example record.
- [ ] Mobile dashboard with the drawer closed.
- [ ] Mobile dashboard with the navigation drawer open.
- [ ] Mobile transaction table or horizontally scrollable table area.

Use a consistent viewport for theme comparisons and make sure sample data is
readable. Do not manufacture screenshots; capture them from the actual running
application.

## 3–5 minute demonstration outline

Target length: about four minutes.

1. **0:00–0:25 — Introduction**
   - State the assignment goal: record student income and expenses and review
     balances.
   - Briefly name the stack: Flask, Python, SQLite, HTML, CSS and JavaScript.
2. **0:25–1:05 — Dashboard**
   - Show total income, expenses and available balance.
   - Explain that the server calculates these values from transaction records
     stored in SQLite.
3. **1:05–1:50 — Add and filter**
   - Add a clearly labeled sample income or expense.
   - Show it in Recent Transactions and demonstrate All/Income/Expenses.
   - Point out the category field and the category spending chart.
4. **1:50–2:30 — Edit and delete**
   - Edit a disposable sample and show the updated row.
   - Demonstrate the delete confirmation using only a disposable sample.
5. **2:30–3:10 — Charts and themes**
   - Explain the monthly income-versus-expense chart and expense category
     breakdown.
   - Switch theme and show the selected theme persists after reload.
6. **3:10–3:40 — Responsive interface**
   - Resize to a mobile viewport and demonstrate the drawer and transaction
     layout.
7. **3:40–4:00 — Code tour**
   - Briefly show one route in `app.py`, the transaction schema in `database.py`
     and the isolated tests in `tests/test_app.py`.

Adapt this outline to what you actually demonstrate. Do not claim a browser or
device test unless you perform it.

## Files, routes, database and concepts to explain

### Main files

- `app.py`: Flask application setup, dashboard data queries, route handlers and
  server-side form validation.
- `database.py`: opens a SQLite connection for the request, closes it at
  teardown and creates the `transactions` table if absent.
- `templates/index.html`: Jinja dashboard, summary cards, chart canvases,
  transaction filters/table and add form.
- `templates/edit.html`: prefilled edit form.
- `static/css/style.css`: shared visual theme, responsive layout and mobile
  drawer styling.
- `static/js/script.js`: theme persistence, default date and sidebar behavior.
- `static/js/charts.js`: reads server-provided chart data and initializes
  Chart.js charts.
- `tests/test_app.py`: Flask test client CRUD and dashboard tests with a
  temporary database.
- `requirements.txt`: Flask and python-dotenv dependencies.

### Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/` | GET | Dashboard, totals, recent five transactions, type filter and chart data |
| `/add` | POST | Validate and add a transaction |
| `/edit/<transaction_id>` | GET | Show the selected transaction in the edit form |
| `/edit/<transaction_id>` | POST | Validate and save transaction changes |
| `/delete/<transaction_id>` | POST | Delete the selected transaction |

### Database

The Week 1 feature uses the `transactions` SQLite table. Its columns are:

- `id`: integer primary key.
- `title`: required transaction description.
- `amount`: required positive numeric amount.
- `type`: `income` or `expense`.
- `category`: required category name.
- `date`: required date stored as text in `YYYY-MM-DD` form.
- `notes`: optional notes.
- `created_at`: timestamp set when the record is inserted.

Current code may find additional empty legacy tables in an existing database.
They are not part of this assignment's active schema or routes; they were left
untouched to avoid risking existing data.

### Concepts to understand

- Flask route decorators and the difference between GET and POST requests.
- Reading submitted form values and validating them on the server.
- Parameterized SQL queries and why user input should not be concatenated into
  SQL statements.
- SQLite connections, commits, row factories and request teardown.
- CRUD: create, read, update and delete.
- Aggregation with `SUM`, `CASE`, `GROUP BY`, `COALESCE` and date formatting.
- Passing Python values to Jinja templates and looping over rows.
- Using a query parameter to select the transaction type filter.
- Passing chart values from Flask to the page as JSON-compatible data.
- Chart.js chart datasets and theme-aware presentation.
- Browser `localStorage` for theme preference.
- Responsive CSS, media queries, keyboard/focus accessibility and mobile
  navigation behavior.
- Isolating automated tests from the real database using a temporary file.

### Out-of-scope development leftovers

- The active entry point is `app.py`. The inactive `.app.py` snapshot contains
  old Flask-Mail/SMTP configuration but no registered routes were found there.
- No login, registration, verification, reset-password, ownership or
  multi-user behavior is implemented in the active app.
- The active database may still contain empty tables named `users`,
  `auth_tokens`, `auth_rate_limits`, `budgets`, `savings_goals` and
  `savings_contributions`. They were not dropped. At the last read-only check,
  each was empty and the two transaction rows matched the backup.
- Flask-Mail, Flask-WTF and WTForms may remain installed in the existing local
  virtual environment from earlier work. They are not listed in
  `requirements.txt` and are not used by the Week 1 app. They were not
  uninstalled.

## Eight YouTube tutorial research reports

No tutorial links, viewing history or personal learning reflections are
provided here. For each of the eight assigned reports, find and watch the
source yourself, then complete a separate copy of this record using your own
notes.

For **each report**, check that you have:

- [ ] The actual video title, channel/creator and working YouTube URL.
- [ ] The date you accessed and watched it, and the relevant timestamp range.
- [ ] A short summary in your own words.
- [ ] The specific concept(s) demonstrated.
- [ ] A factual note connecting the tutorial to a part of this project, where
  applicable.
- [ ] Your own reflection: what you understood, what remains unclear and what
  you would try next.
- [ ] Any code or assets used are attributed and permitted by the assignment.
- [ ] Details are accurate; do not copy the creator's description as a personal
  learning reflection.

### Report 1

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 2

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 3

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 4

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 5

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 6

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 7

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:

### Report 8

- Video title:
- Creator/channel:
- YouTube URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to this project:
- My reflection / questions:
