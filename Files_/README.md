# Third-Party Vendor Risk Tiering Model

An end-to-end **vendor risk management** project: a machine learning model that tiers 520 third-party vendors into Low/Medium/High risk, backed by SQL analysis, an Excel scorecard, and a quarterly review deck — the full toolkit a Risk Process Analyst actually delivers with, not just a model in a notebook.

**[View the Quarterly Vendor Risk Review (PDF)](outputs/Vendor_Risk_Review_Q3_2026.pdf)** · **[Download the Vendor Risk Scorecard (Excel)](outputs/Vendor_Risk_Scorecard.xlsx)**

## Why this project

Most ML portfolio projects stop at a Jupyter notebook. Vendor risk management runs on SQL, Excel, and PowerPoint as much as it runs on a model — so this project ships all four, wired together end to end: the model's output is the single source of truth for the SQL queries, the Excel dashboard, and the slide deck.

## What's inside

- **`src/01_generate_data.py`** — generates a synthetic population of 520 third-party vendors across 10 industries, with realistic risk drivers: data access level, business criticality, financial health, compliance/SLA history, security certification, geographic risk, sanctions screening, and due-diligence staleness.
- **`src/02_train_model.py`** — trains a Random Forest classifier to tier vendors into Low / Medium / High risk from 16 vendor attributes.
- **`src/03_validate.py`** — full validation suite: accuracy, per-class precision/recall/F1, AUC (one-vs-rest), confusion matrix, and aggregated feature importance. Scores the full vendor population with a blended 0–100 risk score.
- **`src/04_build_db.py`** + **`sql/*.sql`** — loads the scored population into SQLite and runs six analyst-style queries: overdue reassessments, spend concentration by tier, risk-weighted exposure ranking, tier distribution by industry, a data-access/certification control-gap query, and a sanctions/compliance escalation list.
- **`src/06_build_excel.py`** — builds a 4-tab Excel workbook (`openpyxl`): a formula-driven Dashboard (COUNTIFS/SUMIFS/AVERAGEIFS — not hardcoded numbers), the full Vendor Scorecard with conditional formatting by tier, a High Risk Detail tab with recommended actions, and a Data Dictionary.
- **`src/07_build_deck.js`** — builds an 8-slide Quarterly Vendor Risk Review deck (`pptxgenjs`): executive summary, methodology, risk distribution, model performance (including an honest finding about where the model is weaker), top high-risk vendors, industry concentration, and recommendations.

## A finding worth mentioning

The model performs well distinguishing clear Low- and High-risk vendors (AUC 0.87 and 0.85) but is noticeably weaker on the Medium tier (AUC 0.73) — a realistic pattern in ordinal risk classification. Rather than papering over it, the deck calls it out directly and recommends routing model-predicted Medium-tier vendors through a lightweight analyst review instead of full automation. Reporting a model's limitations accurately is part of the deliverable, not a flaw to hide.

## Stack

Python (scikit-learn, pandas, matplotlib) for the model and validation · SQLite for the SQL layer · openpyxl for Excel · pptxgenjs for PowerPoint.

## Reproduce it

```bash
pip install pandas numpy scikit-learn matplotlib openpyxl joblib
python src/01_generate_data.py
python src/02_train_model.py
python src/03_validate.py
python src/04_build_db.py
python src/05_run_queries.py
python src/06_build_excel.py
node src/07_build_deck.js   # requires: npm install pptxgenjs
```

---
*All vendor data is synthetically generated for demonstration purposes and does not represent real companies.*
