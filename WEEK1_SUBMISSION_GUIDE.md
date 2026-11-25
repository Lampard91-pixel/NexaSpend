# NEXASPEND — WEEK 1 SUBMISSION GUIDE

**Program:** NEXAVARO Student Developer Program  
**Project:** Student Expense Manager (NexaSpend)  
**Technology:** Python, Flask, SQLite, HTML, CSS and JavaScript  
**GitHub Repository:** https://github.com/Lampard91-pixel/NexaSpend

This document explains the application, its implementation, testing, tutorial research, screenshots and demonstration preparation.

Complete outstanding activities honestly. Do not claim to have watched tutorials or recorded a demonstration until you have actually done so.

---

# 1. AUTOMATED TESTING

### Automated checks recorded

Run the tests from the project root:

```powershell
python -m unittest discover -s tests -v
```

Latest recorded result: **6 tests passed**, using the test module's temporary SQLite database.

- [x] Dashboard renders total income, expenses, balance, filter controls and chart data.
- [x] Income filter displays income records and excludes expenses.
- [x] Valid transaction can be added and persisted.
- [x] Invalid amount and invalid date are rejected.
- [x] Edit page renders and a transaction can be updated.
- [x] Existing transaction can be deleted; a different test transaction stays.
- [x] Missing transaction IDs return HTTP 404 for edit and delete.
- [x] Python files compile with `py_compile`.
- [x] `static/js/script.js` and `static/js/charts.js` pass `node --check`.
- [x] A mock Chart.js runtime harness confirmed that monthly and category chart data initialize and chart colors refresh when the theme changes. This was a mocked check, not a visual browser test.

### Database integrity checks recorded

- [x] The active `instance/expenses.db` returned `ok` for SQLite `PRAGMA integrity_check`.
- [x] The active database contained two transaction rows (IDs 3 and 4) at the time of the read-only check.
- [x] A SHA-256 comparison of the active transaction rows with `instance/expenses-backup-20261124-224825.db` matched exactly.
- [x] The backup also returned `ok` for SQLite integrity.
- [x] These database checks were read-only.

---

# 2. MANUAL BROWSER TESTING

### Checks completed

- [x] Started the Flask application and confirmed the dashboard loaded.
- [x] Added income and expense records and confirmed dashboard totals changed.
- [x] Edited a test transaction and confirmed the updated values appeared.
- [x] Deleted a disposable test transaction.
- [x] Tested All, Income and Expenses filters.
- [x] Confirmed the expense category and monthly spending charts displayed.
- [x] Switched between dark and light themes and confirmed preferences persisted after refreshing.
- [x] Tested the mobile layout and navigation drawer.
- [x] Captured desktop and mobile application screenshots.

### Additional checks outstanding

- [ ] Explicitly verify that the delete confirmation prompt appears.
- [ ] Check add/edit forms and the transaction table at desktop, tablet and mobile widths.
- [ ] Inspect the browser console for JavaScript errors.
- [ ] Confirm there are no application errors in the Flask terminal.

### Testing limitations

- Testing was performed in the local development environment.
- Testing has not established production deployment or compatibility with every browser and device.
- The chart runtime check used a mock Chart.js object.
- No authentication, multi-user isolation, budget, savings or export features were tested because they are outside the current Week 1 scope.

---

# 3. APPLICATION SCREENSHOTS

Screenshots have been captured and uploaded to `tests/screenshots/`.

- [x] `01-desktop-dark.png` — Desktop dashboard in dark theme.
- [x] `02-desktop-light.png` — Desktop dashboard in light theme.
- [x] `03-all-transactions.png` — All transactions filter.
- [x] `04-income-filter.png` — Income filter.
- [x] `05-expenses-filter.png` — Expenses filter.
- [x] `06-add-transaction.png` — Add transaction form.
- [x] `07-edit-transaction.png` — Edit transaction form.
- [x] `08-mobile-menu-closed.png` — Mobile navigation drawer closed.
- [x] `09-mobile-menu-open.png` — Mobile navigation drawer open.
- [ ] Additional mobile transaction table screenshot, if required.

Use representative, non-sensitive sample data. Avoid showing private financial details, passwords or environment variables.

---

# 4. THREE-TO-FIVE-MINUTE DEMONSTRATION VIDEO

**Status: Not yet recorded.**

Suggested duration: approximately four minutes.

### 0:00–0:25 — Introduction

- Introduce NexaSpend.
- Explain that the application helps students record income and expenses and monitor their balance.
- Mention the technology stack: Python, Flask, SQLite, HTML, CSS and JavaScript.

### 0:25–1:05 — Dashboard

- Show total income, expenses and available balance.
- Explain that the figures are calculated from transaction records stored in SQLite.

### 1:05–1:50 — Adding and filtering transactions

- Add a clearly labelled sample transaction.
- Show the transaction in the recent transactions table.
- Demonstrate All, Income and Expenses filters.

### 1:50–2:30 — Editing and deleting

- Edit a disposable sample transaction.
- Show the updated transaction.
- Demonstrate the delete confirmation if verified.

### 2:30–3:10 — Charts and themes

- Explain the monthly spending chart.
- Explain the expense category breakdown.
- Switch between dark and light themes.
- Show that the theme preference persists after refreshing.

### 3:10–3:40 — Responsive interface

- Demonstrate the mobile layout.
- Open and close the navigation drawer.

### 3:40–4:00 — Code overview

- Show a route in `app.py`.
- Explain the transaction table in `database.py`.
- Briefly show the automated tests in `tests/test_app.py`.

Do not claim to have performed a test unless you actually demonstrate or verify it.

---

# 5. MAIN PROJECT FILES

| File | Purpose |
|---|---|
| `app.py` | Flask setup, dashboard queries, route handlers and server-side validation |
| `database.py` | SQLite connection management and database initialization |
| `templates/index.html` | Dashboard, summary cards, charts, filters and transaction table |
| `templates/edit.html` | Prefilled transaction editing form |
| `static/css/style.css` | Themes, layout and responsive styling |
| `static/js/script.js` | Theme persistence, default date and sidebar behavior |
| `static/js/charts.js` | Chart.js initialization and chart presentation |
| `tests/test_app.py` | Automated Flask application tests |
| `requirements.txt` | Project Python dependencies |
| `README.md` | Project overview and setup instructions |
| `WEEK1_SUBMISSION_GUIDE.md` | Week 1 testing and submission documentation |

---

# 6. APPLICATION ROUTES

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Dashboard, totals, transactions, filters and chart data |
| `/add` | POST | Validate and add a transaction |
| `/edit/<transaction_id>` | GET | Display the selected transaction for editing |
| `/edit/<transaction_id>` | POST | Validate and save transaction changes |
| `/delete/<transaction_id>` | POST | Delete the selected transaction |

---

# 7. DATABASE STRUCTURE

The Week 1 application uses a SQLite table called `transactions`.

| Column | Purpose |
|---|---|
| `id` | Integer primary key |
| `title` | Required transaction description |
| `amount` | Required positive numeric amount |
| `type` | Income or expense |
| `category` | Transaction category |
| `date` | Transaction date stored as `YYYY-MM-DD` |
| `notes` | Optional notes |
| `created_at` | Record creation timestamp |

The existing database may contain additional legacy tables from earlier development. They were left untouched to avoid risking existing data.

---

# 8. PROGRAMMING CONCEPTS TO UNDERSTAND

Be prepared to explain:

1. Flask route decorators.
2. The difference between GET and POST requests.
3. Reading submitted form values.
4. Server-side form validation.
5. Parameterized SQL queries.
6. SQLite connections, commits and database operations.
7. CRUD: Create, Read, Update and Delete.
8. SQL aggregation using `SUM`, `CASE`, `GROUP BY` and `COALESCE`.
9. Passing Python values to Jinja templates.
10. Filtering records using query parameters.
11. Passing chart data from Flask to JavaScript.
12. Chart.js datasets and theme-aware presentation.
13. Browser `localStorage` for theme preferences.
14. Responsive CSS and media queries.
15. Automated testing using a temporary database.

---

# 9. OUT-OF-SCOPE DEVELOPMENT LEFTOVERS

- The active application entry point is `app.py`.
- The inactive `.app.py` snapshot contains old Flask-Mail/SMTP configuration.
- The active application does not implement login, registration, email verification, password reset or multi-user ownership.
- Legacy database tables may remain from earlier development. They were not dropped.
- Flask-Mail, Flask-WTF and WTForms may remain installed in the existing local virtual environment but are not listed in `requirements.txt` or used by the Week 1 application.

---

# 10. EIGHT YOUTUBE TUTORIAL RESEARCH REPORTS

The following are recommended learning resources connected to the technologies used in NexaSpend.

**Important:** Watch each selected tutorial before completing its report. Record the actual video title and URL, date watched, timestamps and personal learning reflections. Do not claim to have watched a video before doing so.

## REPORT 1 — FLASK FUNDAMENTALS

**Recommended creator:** Corey Schafer

**Video title:** Python Flask Tutorial: Full-Featured Web App Part 1 - Getting Started

**Direct YouTube link:**

https://www.youtube.com/watch?v=MwZwr5Tvyxo

**Topics to study:**
- What Flask is.
- Installing Flask.
- Creating a Flask application.
- Defining routes.
- Running a local development server.
- Returning responses to the browser.

**Research report:**

- Video title:
- Creator/channel: Corey Schafer
- YouTube URL: https://www.youtube.com/watch?v=MwZwr5Tvyxo
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 2 — FLASK FORMS, REQUESTS AND CRUD

**Recommended creator:** Tech With Tim

**YouTube channel:**

https://www.youtube.com/@TechWithTim

**YouTube search for the recommended topic:**

https://www.youtube.com/results?search_query=Tech+With+Tim+Flask+forms+GET+POST+CRUD+tutorial

**Topics to study:**
- HTML forms and Flask.
- GET and POST requests.
- Reading submitted form values.
- Handling user input.
- Creating, updating and deleting records.

**Research report:**

- Actual video title:
- Creator/channel: Tech With Tim
- Actual video URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 3 — PYTHON AND SQLITE DATABASES

**Recommended creator:** Corey Schafer

**Video title:** Python Flask Tutorial: Full-Featured Web App Part 4 - Database with Flask-SQLAlchemy

**Direct YouTube link:**

https://www.youtube.com/watch?v=cYWiDiIUxQc

**Topics to study:**
- Database concepts.
- SQLite integration.
- Database tables.
- Storing application records.
- Retrieving information.
- Database relationships.

**Research report:**

- Video title:
- Creator/channel: Corey Schafer
- YouTube URL: https://www.youtube.com/watch?v=cYWiDiIUxQc
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

**Note:** The tutorial uses Flask-SQLAlchemy, while NexaSpend uses SQLite directly. Focus on the database concepts and understand the difference between the approaches.

## REPORT 4 — HTML AND CSS FUNDAMENTALS

**Recommended creator:** Kevin Powell

**Video title:** HTML & CSS for Absolute Beginners: Introduction

**Direct YouTube link:**

https://www.youtube.com/watch?v=1L2YiWdaUDM

**Topics to study:**
- HTML page structure.
- CSS selectors.
- Styling elements.
- Layout fundamentals.
- Building responsive pages.

**Research report:**

- Video title:
- Creator/channel: Kevin Powell
- YouTube URL: https://www.youtube.com/watch?v=1L2YiWdaUDM
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 5 — JAVASCRIPT AND DOM MANIPULATION

**Recommended creator:** freeCodeCamp.org

**YouTube channel:**

https://www.youtube.com/@freecodecamp

**YouTube search for the recommended topic:**

https://www.youtube.com/results?search_query=freeCodeCamp+JavaScript+DOM+manipulation+full+course

**Topics to study:**
- JavaScript fundamentals.
- Selecting HTML elements.
- Event listeners.
- Changing page content.
- Manipulating CSS classes.
- Responding to user interactions.

**Research report:**

- Actual video title:
- Creator/channel: freeCodeCamp.org
- Actual video URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 6 — GIT AND GITHUB

**Recommended creator:** freeCodeCamp.org

**Video title:** Git & GitHub Crash Course for Beginners [2026]

**Direct YouTube link:**

https://www.youtube.com/watch?v=mAFoROnOfHs

**Topics to study:**
- Version control.
- Creating repositories.
- Staging files with `git add`.
- Saving commits.
- Connecting a local project to GitHub.
- Pushing changes.
- Checking repository history.

**Research report:**

- Video title:
- Creator/channel: freeCodeCamp.org
- YouTube URL: https://www.youtube.com/watch?v=mAFoROnOfHs
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 7 — PYTHON AUTOMATED TESTING

**Recommended creator:** freeCodeCamp.org

**YouTube channel:**

https://www.youtube.com/@freecodecamp

**YouTube search for the recommended topic:**

https://www.youtube.com/results?search_query=freeCodeCamp+Python+unittest+pytest+testing+tutorial

**Topics to study:**
- Why software testing is important.
- Writing test cases.
- Testing expected results.
- Testing application behavior.
- Identifying errors.
- Using assertions.
- Understanding automated tests.

**Research report:**

- Actual video title:
- Creator/channel: freeCodeCamp.org
- Actual video URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

## REPORT 8 — RESPONSIVE WEB DESIGN

**Recommended creator:** Kevin Powell

**YouTube channel:**

https://www.youtube.com/@KevinPowell

**YouTube search for the recommended topic:**

https://www.youtube.com/results?search_query=Kevin+Powell+responsive+web+design+media+queries+beginner

**Topics to study:**
- Responsive web design.
- CSS media queries.
- Flexible layouts.
- Mobile-first design.
- Responsive navigation.
- Adapting a website to different screen sizes.

**Research report:**

- Actual video title:
- Creator/channel: Kevin Powell
- Actual video URL:
- Date watched:
- Timestamps reviewed:
- Concepts demonstrated:
- Summary in my own words:
- Connection to NexaSpend:
- My reflection/questions:

---

# 11. AI ASSISTANCE DISCLOSURE

**Status: To be reviewed and finalized before submission.**

Suggested disclosure:

During the development of NexaSpend, I used AI tools, including ChatGPT and GitHub Copilot, as development assistance.

I used these tools for programming explanations, troubleshooting, debugging guidance, code review and assistance with improving parts of the application.

I reviewed the project files, ran the application, tested its features and used the development environment to verify its functionality.

I understand that I am responsible for the application and should be able to explain its code, database structure, routes, features and implementation decisions independently.

Before submission, ensure this disclosure accurately describes the assistance received and the work personally completed.

---

# 12. GITHUB REPOSITORY

**Project name:** NexaSpend

**Repository link:**

https://github.com/Lampard91-pixel/NexaSpend

The repository contains:

- Application source code.
- Flask routes and database implementation.
- HTML templates.
- CSS and JavaScript files.
- Automated tests.
- README documentation.
- Application screenshots.
- Week 1 submission guide.

---

# 13. FINAL WEEK 1 SUBMISSION CHECKLIST

- [x] Student Expense Manager application implemented.
- [x] Flask and SQLite application files prepared.
- [x] Application manually tested for core features.
- [x] Automated tests recorded.
- [x] Screenshots captured.
- [x] Screenshots uploaded to GitHub.
- [x] README uploaded to GitHub.
- [x] Submission guide uploaded to GitHub.
- [ ] Remaining browser checks completed or accurately documented.
- [ ] Eight YouTube tutorial reports completed.
- [ ] Three-to-five-minute demonstration video recorded.
- [ ] AI assistance disclosure reviewed and finalized.
- [ ] GitHub repository checked for all required files.
- [ ] Submission email sent to the program contact.

**Program submission contact:**

hello@nexavarotech.com

Do not describe the Week 1 submission as fully complete until all outstanding requirements have been completed or the program team has agreed that they may be submitted separately.
### Automated Testing Results

The application was tested using Python's built-in `unittest` framework.

**Command used:**
```powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

**Result:** 6 tests passed, 0 failures, 0 errors.

The tests covered:
- Adding valid transactions.
- Rejecting invalid transaction values.
- Dashboard totals, filters and chart data.
- Deleting transactions.
- Editing transactions.
- Handling missing transactions with a 404 response.

**Execution time:** 0.237 seconds.