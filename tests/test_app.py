import importlib
import os
import tempfile
import unittest


_test_directory = tempfile.TemporaryDirectory(prefix="nexaspend-tests-")
_database_path = os.path.join(_test_directory.name, "test-expenses.db")
os.environ["NEXASPEND_DATABASE"] = _database_path

application_module = importlib.import_module("app")
app = application_module.app
app.config.update(TESTING=True)


class TransactionRouteTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with app.app_context():
            db = application_module.get_db()
            db.execute("DELETE FROM transactions")
            db.execute("""
                INSERT INTO transactions
                    (title, amount, type, category, date, notes)
                VALUES
                    ('Test income', 100, 'income', 'Work', '2026-11-02', ''),
                    ('Test expense', 40, 'expense', 'Food', '2026-11-03', '')
            """)
            db.commit()
            self.expense_id = db.execute(
                "SELECT id FROM transactions WHERE title='Test expense'"
            ).fetchone()["id"]

    def test_dashboard_renders_totals_filters_and_chart_data(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Total Income", response.data)
        self.assertIn(b"100.00", response.data)
        self.assertIn(b"60.00", response.data)
        self.assertIn(b'id="monthlyChart"', response.data)
        self.assertIn(b'id="categoryChart"', response.data)
        self.assertIn(b"data-monthly-income='[100.0]'", response.data)
        self.assertIn(b"data-monthly-expenses='[40.0]'", response.data)
        self.assertIn(b"data-category-labels=", response.data)

        filtered = self.client.get("/?type=income")
        self.assertEqual(filtered.status_code, 200)
        self.assertIn(b"Test income", filtered.data)
        self.assertNotIn(b"Test expense", filtered.data)

    def test_add_transaction_persists_valid_record(self):
        response = self.client.post("/add", data={
            "title": "New bus fare",
            "amount": "12.50",
            "type": "expense",
            "category": "Transport",
            "date": "2026-11-04",
            "notes": "Campus trip",
        })
        self.assertEqual(response.status_code, 302)

        with app.app_context():
            row = application_module.get_db().execute(
                "SELECT * FROM transactions WHERE title='New bus fare'"
            ).fetchone()
            self.assertIsNotNone(row)
            self.assertEqual(row["amount"], 12.5)
            self.assertEqual(row["type"], "expense")

    def test_add_transaction_rejects_invalid_values(self):
        response = self.client.post("/add", data={
            "title": "Bad amount",
            "amount": "nan",
            "type": "expense",
            "category": "Food",
            "date": "2026-11-04",
        })
        self.assertEqual(response.status_code, 400)

        response = self.client.post("/add", data={
            "title": "Bad date",
            "amount": "12",
            "type": "expense",
            "category": "Food",
            "date": "not-a-date",
        })
        self.assertEqual(response.status_code, 400)

    def test_edit_page_and_update_transaction(self):
        response = self.client.get(f"/edit/{self.expense_id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Test expense", response.data)

        response = self.client.post(f"/edit/{self.expense_id}", data={
            "title": "Updated meal",
            "amount": "55.25",
            "type": "expense",
            "category": "Dining",
            "date": "2026-11-05",
            "notes": "Updated by test",
        })
        self.assertEqual(response.status_code, 302)

        with app.app_context():
            row = application_module.get_db().execute(
                "SELECT * FROM transactions WHERE id=?",
                (self.expense_id,),
            ).fetchone()
            self.assertEqual(row["title"], "Updated meal")
            self.assertEqual(row["amount"], 55.25)
            self.assertEqual(row["category"], "Dining")

    def test_delete_transaction(self):
        response = self.client.post(f"/delete/{self.expense_id}")
        self.assertEqual(response.status_code, 302)

        with app.app_context():
            db = application_module.get_db()
            self.assertIsNone(db.execute(
                "SELECT id FROM transactions WHERE id=?",
                (self.expense_id,),
            ).fetchone())
            self.assertIsNotNone(db.execute(
                "SELECT id FROM transactions WHERE title='Test income'"
            ).fetchone())

    def test_missing_transaction_returns_not_found(self):
        self.assertEqual(self.client.get("/edit/999999").status_code, 404)
        self.assertEqual(self.client.post("/delete/999999").status_code, 404)


if __name__ == "__main__":
    unittest.main()
