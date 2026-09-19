import sqlite3
import glob
import os
import pandas as pd

conn = sqlite3.connect("/home/claude/vendor_risk_project/outputs/vendor_risk.db")
sql_dir = "/home/claude/vendor_risk_project/sql/"
out_dir = "/home/claude/vendor_risk_project/outputs/query_results/"
os.makedirs(out_dir, exist_ok=True)

query_files = sorted(glob.glob(sql_dir + "*.sql"))
summary = {}
for qf in query_files:
    name = os.path.basename(qf).replace(".sql", "")
    sql = open(qf).read()
    result = pd.read_sql_query(sql, conn)
    result.to_csv(out_dir + name + ".csv", index=False)
    summary[name] = len(result)
    print(f"--- {name} ({len(result)} rows) ---")
    print(result.head(6).to_string(index=False))
    print()

conn.close()
