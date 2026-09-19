import json
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import label_binarize

CH = "/home/claude/vendor_risk_project/charts/"
OUT = "/home/claude/vendor_risk_project/outputs/"
CLASSES = ["Low", "Medium", "High"]

pipe = joblib.load(OUT + "model.joblib")
feats = json.load(open(OUT + "features.json"))
FEATURES = feats["num"] + feats["cat"]
test = pd.read_csv(OUT + "test_set.csv")
X_test = test[FEATURES]
y_test = test["risk_tier"]

pred = pipe.predict(X_test)
proba = pipe.predict_proba(X_test)
class_order = list(pipe.named_steps["clf"].classes_)

report = classification_report(y_test, pred, labels=CLASSES, output_dict=True, zero_division=0)
cm = confusion_matrix(y_test, pred, labels=CLASSES)

y_test_bin = label_binarize(y_test, classes=CLASSES)
proba_ordered = proba[:, [class_order.index(c) for c in CLASSES]]
auc_ovr = {c: round(float(roc_auc_score(y_test_bin[:, i], proba_ordered[:, i])), 4)
           for i, c in enumerate(CLASSES)}

results = {
    "classification_report": report,
    "confusion_matrix": cm.tolist(),
    "classes": CLASSES,
    "accuracy": round(float((pred == y_test).mean()), 4),
    "auc_ovr": auc_ovr,
    "n_test": int(len(y_test)),
}

# ---------- confusion matrix chart ----------
plt.figure(figsize=(5, 4.5))
plt.imshow(cm, cmap="Blues")
plt.xticks(range(3), CLASSES)
plt.yticks(range(3), CLASSES)
plt.xlabel("Predicted tier")
plt.ylabel("Actual tier")
for i in range(3):
    for j in range(3):
        plt.text(j, i, str(cm[i, j]), ha="center", va="center",
                  color="white" if cm[i, j] > cm.max() / 2 else "black", fontsize=13)
plt.title("Confusion matrix - holdout test set")
plt.tight_layout()
plt.savefig(CH + "confusion_matrix.png", dpi=150)
plt.close()

# ---------- feature importance (post one-hot, aggregated back to source feature) ----------
ohe = pipe.named_steps["pre"].named_transformers_["cat"]
cat_names = list(ohe.get_feature_names_out(feats["cat"]))
all_names = feats["num"] + cat_names
importances = pipe.named_steps["clf"].feature_importances_

imp_df = pd.DataFrame({"feature": all_names, "importance": importances})
def source_feature(n):
    if n in feats["num"]:
        return n
    for c in feats["cat"]:
        if n.startswith(c + "_"):
            return c
    return n
imp_df["source"] = imp_df["feature"].apply(source_feature)
agg_imp = imp_df.groupby("source")["importance"].sum().sort_values()
results["feature_importance"] = agg_imp.round(4).to_dict()

plt.figure(figsize=(6.5, 4.5))
plt.barh(agg_imp.index, agg_imp.values, color="#534AB7")
plt.title("Feature importance (aggregated by source feature)")
plt.tight_layout()
plt.savefig(CH + "feature_importance.png", dpi=150)
plt.close()

# ---------- tier distribution chart ----------
full_df = pd.read_csv("/home/claude/vendor_risk_project/data/vendors.csv")
tier_counts = full_df["risk_tier"].value_counts().reindex(CLASSES)
plt.figure(figsize=(5, 3.8))
colors = {"Low": "#3B6D11", "Medium": "#854F0B", "High": "#A32D2D"}
plt.bar(tier_counts.index, tier_counts.values, color=[colors[c] for c in tier_counts.index])
for i, v in enumerate(tier_counts.values):
    plt.text(i, v + 4, str(v), ha="center", fontsize=11)
plt.title("Vendor population by risk tier (n=520)")
plt.tight_layout()
plt.savefig(CH + "tier_distribution.png", dpi=150)
plt.close()

# ---------- spend by tier ----------
spend_by_tier = full_df.groupby("risk_tier")["annual_spend_usd"].sum().reindex(CLASSES) / 1e6
plt.figure(figsize=(5, 3.8))
plt.bar(spend_by_tier.index, spend_by_tier.values, color=[colors[c] for c in spend_by_tier.index])
for i, v in enumerate(spend_by_tier.values):
    plt.text(i, v + 0.3, f"${v:.1f}M", ha="center", fontsize=11)
plt.title("Annual spend by risk tier")
plt.ylabel("Annual spend ($M)")
plt.tight_layout()
plt.savefig(CH + "spend_by_tier.png", dpi=150)
plt.close()

with open(OUT + "results.json", "w") as f:
    json.dump(results, f, indent=2)

# ---------- score the FULL population (for Excel/SQL deliverables) ----------
X_full = full_df[FEATURES]
full_proba = pipe.predict_proba(X_full)
full_pred = pipe.predict(X_full)
class_order = list(pipe.named_steps["clf"].classes_)
p_low = full_proba[:, class_order.index("Low")]
p_med = full_proba[:, class_order.index("Medium")]
p_high = full_proba[:, class_order.index("High")]
risk_score_0_100 = np.round(100 * (p_med * 0.5 + p_high * 1.0), 1)

scored = full_df.copy()
scored["predicted_tier"] = full_pred
scored["risk_score_0_100"] = risk_score_0_100
scored["p_low"] = p_low.round(4)
scored["p_medium"] = p_med.round(4)
scored["p_high"] = p_high.round(4)
scored.to_csv(OUT + "vendors_scored.csv", index=False)

print(json.dumps(results["classification_report"]["weighted avg"], indent=2))
print("accuracy:", results["accuracy"])
print("auc_ovr:", results["auc_ovr"])
print(scored[["vendor_id", "risk_tier", "predicted_tier", "risk_score_0_100"]].head())
