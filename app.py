import math
import os
from datetime import datetime
from secrets import token_hex

from dotenv import load_dotenv

from flask import (
    Flask,
    abort,
    redirect,
    render_template,
    request,
    url_for,
)

from database import close_db, get_db, init_db

load_dotenv()

app = Flask(__name__)
os.makedirs(app.instance_path, exist_ok=True)

app.config["DATABASE"] = os.getenv(
    "NEXASPEND_DATABASE",
    os.path.join(app.instance_path, "expenses.db"),
)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY") or token_hex(32)
app.config["MAX_CONTENT_LENGTH"] = 2 * 1024 * 1024

app.teardown_appcontext(close_db)

with app.app_context():
    init_db()


@app.route("/")
def index():
    db = get_db()

    selected_type = request.args.get("type", "all")
    if selected_type not in ("all", "income", "expense"):
        selected_type = "all"

    if selected_type == "all":
        transactions = db.execute("""
            SELECT * FROM transactions
            ORDER BY date DESC, id DESC
            LIMIT 5
        """).fetchall()
    else:
        transactions = db.execute("""
            SELECT * FROM transactions
            WHERE type = ?
            ORDER BY date DESC, id DESC
            LIMIT 5
        """, (selected_type,)).fetchall()

    income = db.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'income'
    """).fetchone()[0]

    expenses = db.execute("""
        SELECT COALESCE(SUM(amount), 0)
        FROM transactions
        WHERE type = 'expense'
    """).fetchone()[0]

    category_data = db.execute("""
        SELECT category, SUM(amount) AS total
        FROM transactions
        WHERE type = 'expense'
        GROUP BY category
        ORDER BY total DESC
    """).fetchall()

    monthly_data = db.execute("""
        SELECT
            strftime('%Y-%m', date) AS month,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END)
                AS monthly_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)
                AS monthly_expenses
        FROM transactions
        GROUP BY strftime('%Y-%m', date)
        ORDER BY month DESC
        LIMIT 6
    """).fetchall()
    monthly_data = list(reversed(monthly_data))

    return render_template(
        "index.html",
        transactions=transactions,
        income=income,
        expenses=expenses,
        balance=income - expenses,
        selected_type=selected_type,
        category_labels=[row["category"] for row in category_data],
        category_amounts=[row["total"] for row in category_data],
        monthly_labels=[row["month"] for row in monthly_data],
        monthly_income=[row["monthly_income"] for row in monthly_data],
        monthly_expenses=[row["monthly_expenses"] for row in monthly_data],
    )


def read_transaction_form():
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "").strip()
    transaction_type = request.form.get("type", "").strip()
    transaction_date = request.form.get("date", "").strip()
    notes = request.form.get("notes", "").strip()

    try:
        amount = float(request.form.get("amount", ""))
    except (TypeError, ValueError):
        abort(400, description="Invalid transaction amount.")

    if (
        not title
        or len(title) > 100
        or not category
        or len(category) > 50
        or not math.isfinite(amount)
        or amount <= 0
        or transaction_type not in ("income", "expense")
    ):
        abort(400, description="Please provide valid transaction details.")

    try:
        datetime.strptime(transaction_date, "%Y-%m-%d")
    except ValueError:
        abort(400, description="Please provide a valid transaction date.")

    return title, amount, transaction_type, category, transaction_date, notes


@app.route("/add", methods=["POST"])
def add_transaction():
    transaction = read_transaction_form()
    db = get_db()
    db.execute("""
        INSERT INTO transactions
            (title, amount, type, category, date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
    """, transaction)
    db.commit()
    return redirect(url_for("index"))


@app.route("/edit/<int:transaction_id>", methods=["GET", "POST"])
def edit_transaction(transaction_id):
    db = get_db()
    transaction = db.execute(
        "SELECT * FROM transactions WHERE id = ?",
        (transaction_id,),
    ).fetchone()

    if transaction is None:
        abort(404)

    if request.method == "POST":
        updated = read_transaction_form()
        db.execute("""
            UPDATE transactions
            SET title = ?, amount = ?, type = ?, category = ?, date = ?, notes = ?
            WHERE id = ?
        """, (*updated, transaction_id))
        db.commit()
        return redirect(url_for("index"))

    return render_template("edit.html", transaction=transaction)


@app.route("/delete/<int:transaction_id>", methods=["POST"])
def delete_transaction(transaction_id):
    db = get_db()
    transaction = db.execute(
        "SELECT id FROM transactions WHERE id = ?",
        (transaction_id,),
    ).fetchone()
    if transaction is None:
        abort(404)

    db.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
    db.commit()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)