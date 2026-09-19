import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

df = pd.read_csv("/home/claude/vendor_risk_project/data/vendors.csv")

NUM_FEATURES = ["annual_spend_usd", "contract_value_usd", "relationship_years",
                 "financial_health_score", "compliance_incidents_3yr", "sla_breach_count_1yr",
                 "on_time_delivery_rate", "last_assessment_days_ago"]
CAT_FEATURES = ["industry", "region_risk", "data_access_level", "business_criticality",
                 "security_certification", "subcontractor_use", "insurance_adequate",
                 "sanctions_screening"]
FEATURES = NUM_FEATURES + CAT_FEATURES
TARGET = "risk_tier"

X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=5, stratify=y
)

pre = ColumnTransformer([
    ("num", SimpleImputer(strategy="median"), NUM_FEATURES),
    ("cat", OneHotEncoder(handle_unknown="ignore"), CAT_FEATURES),
])

pipe = Pipeline([
    ("pre", pre),
    ("clf", RandomForestClassifier(n_estimators=300, max_depth=8, random_state=5,
                                     class_weight="balanced_subsample")),
])
pipe.fit(X_train, y_train)

joblib.dump(pipe, "/home/claude/vendor_risk_project/outputs/model.joblib")
X_test.assign(risk_tier=y_test, vendor_id=df.loc[X_test.index, "vendor_id"].values,
              vendor_name=df.loc[X_test.index, "vendor_name"].values).to_csv(
    "/home/claude/vendor_risk_project/outputs/test_set.csv", index=False
)

with open("/home/claude/vendor_risk_project/outputs/features.json", "w") as f:
    json.dump({"num": NUM_FEATURES, "cat": CAT_FEATURES}, f)

print("train:", X_train.shape, "test:", X_test.shape)
print(y_train.value_counts(normalize=True).round(3))
