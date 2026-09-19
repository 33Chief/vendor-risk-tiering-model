import sqlite3
import pandas as pd

df = pd.read_csv("/home/claude/vendor_risk_project/outputs/vendors_scored.csv")

conn = sqlite3.connect("/home/claude/vendor_risk_project/outputs/vendor_risk.db")
df.to_sql("vendors", conn, if_exists="replace", index=False)

conn.execute("CREATE INDEX idx_tier ON vendors(predicted_tier);")
conn.execute("CREATE INDEX idx_industry ON vendors(industry);")
conn.commit()
conn.close()
print("SQLite DB built:", len(df), "rows")
