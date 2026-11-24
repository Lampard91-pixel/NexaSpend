# NexaSpend Student Expense Manager

NexaSpend is a Flask application for recording and reviewing student income and
expenses. It stores transactions in SQLite and presents totals, recent activity,
category spending and monthly charts in a responsive dashboard.

## Features

- Record income and expenses with a title, amount, category, date and optional
  notes.
- View total income, total expenses and the remaining balance.
- Edit and delete transactions.
- View the five most recent transactions and filter them by all, income or
  expense.
- Review expense totals by category and monthly income-versus-expense charts.
- Switch between dark and light themes; the selected theme is saved in browser
  local storage.
- Use a responsive interface with a mobile navigation drawer and a horizontally
  usable transaction table.
- Persist transactions in a local SQLite database.

This is a Week 1 student assignment project. It does not provide login,
authentication or per-user data isolation. Do not expose this development app
as a multi-user financial service.

## Technologies

- Python
- Flask
- SQLite
- HTML, CSS and JavaScript
- Chart.js, loaded from jsDelivr in the dashboard
- Inter font, loaded from Google Fonts
- python-dotenv for optional local environment configuration

Chart.js and Inter are loaded from external services when the dashboard is
opened, so charts and the selected font require an internet connection.

## Requirements

- Python 3.10 or later
- pip
- A modern web browser
- Internet access for the externally hosted font and Chart.js library

Install the Python dependencies from `requirements.txt`:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

If PowerShell prevents environment activation, either adjust the local
execution policy according to your organization's guidance or run the
environment's Python executable directly:

```powershell
venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run the application

From the project directory, with the virtual environment active:

```powershell
python app.py
```

Open the local address printed by Flask in your browser. The app creates the
`instance` directory and the `expenses.db` SQLite database if they do not
already exist. Existing database files are not replaced by this initialization.

Optional environment settings can be placed in a local `.env` file:

- `SECRET_KEY`: Flask secret key. If omitted, a random key is generated at
  startup.
- `NEXASPEND_DATABASE`: SQLite file path override. If omitted, the app uses
  `instance/expenses.db`.

Do not commit `.env` or put credentials in source code. Email/SMTP is not part
of the Week 1 app.

## Run tests

The automated tests use a temporary SQLite database; they do not use or change
the active `instance/expenses.db`:

```powershell
python -m unittest discover -s tests -v
```

For the latest test checklist and the distinction between automated and manual
checks, see [WEEK1_SUBMISSION_GUIDE.md](WEEK1_SUBMISSION_GUIDE.md).

## Project structure

```text
.
├── app.py                    # Flask app, routes, validation and dashboard queries
├── database.py               # SQLite connection lifecycle and table initialization
├── requirements.txt          # Runtime Python dependencies
├── templates/
│   ├── index.html            # Dashboard, summaries, charts, filters and add form
│   └── edit.html             # Edit transaction form
├── static/
│   ├── css/style.css         # Theme, layout and responsive styles
│   └── js/
│       ├── charts.js         # Chart.js setup and theme-aware chart colors
│       └── script.js         # Theme and mobile navigation interactions
├── tests/
│   └── test_app.py           # Isolated Flask route tests using a temporary DB
└── instance/
    └── expenses.db           # Local SQLite database (ignored by Git)
```

The project also has an inactive `.app.py` file from earlier development. The
application entry point is `app.py`; `.app.py` is not imported by the documented
run command and is not part of the Week 1 feature set.

## Routes and data

- `GET /` renders the dashboard. The `type` query parameter supports `all`,
  `income` or `expense`.
- `POST /add` validates and inserts a transaction.
- `GET /edit/<transaction_id>` displays an existing transaction.
- `POST /edit/<transaction_id>` validates and saves changes.
- `POST /delete/<transaction_id>` deletes an existing transaction.

The `transactions` table stores the transaction ID, title, amount, type,
category, date, optional notes and creation timestamp. Totals and chart data
are calculated from the saved transaction rows.

## Data and scope notes

- The active SQLite database is local application data and is excluded from
  version control. Back it up before making manual database changes.
- The database initializer creates the `transactions` table if needed; it does
  not migrate or remove other tables left by earlier development.
- Legacy empty authentication, budget and savings tables may still be present
  in an existing database. The current Week 1 code does not create or use them,
  and this project does not drop them automatically.
- The interface displays summary totals across the stored transaction history.
  The transaction list shows only the five most recent records; its current
  filters are All, Income and Expenses.
- No CSV/PDF reports, budgets, savings goals, account registration or
  authentication are implemented in this Week 1 scope.
