"""
Generate a synthetic third-party vendor population for a Vendor Risk Tiering
project. ~500 vendors across 10 industries and a mix of geographies, with a
risk score built from realistic vendor-risk-management factors:
data access level, business criticality, financial health, compliance/SLA
history, security certification, geographic risk, sanctions screening,
subcontractor use, insurance adequacy, and due-diligence staleness.

Risk tiers (Low / Medium / High) are derived from the composite score using
quantile cut points, so the class balance mirrors a realistic vendor book
(most vendors low/medium risk; a smaller high-risk tail).
"""
import numpy as np
import pandas as pd

rng = np.random.default_rng(11)
N = 520

INDUSTRIES = ["IT Services", "Cloud/SaaS", "Logistics", "Manufacturing",
              "Financial Services", "Facilities & Maintenance", "Marketing & Media",
              "Staffing", "Payment Processing", "Consulting"]
industry = rng.choice(INDUSTRIES, N, p=[.14,.12,.10,.09,.09,.09,.09,.09,.10,.09])

COUNTRY_RISK = {
    "United States": "Low", "Canada": "Low", "United Kingdom": "Low", "Germany": "Low",
    "Ireland": "Low", "Japan": "Low", "Australia": "Low",
    "India": "Medium", "Mexico": "Medium", "Poland": "Medium", "Philippines": "Medium",
    "Brazil": "Medium", "South Africa": "Medium",
    "China": "High", "Nigeria": "High", "Russia": "High", "Venezuela": "High",
}
countries = list(COUNTRY_RISK.keys())
country_p = [.16,.07,.09,.06,.03,.03,.03, .10,.06,.05,.07, .05,.03, .06,.02,.02,.02]
country_p = np.array(country_p) / np.sum(country_p)
country = rng.choice(countries, N, p=country_p)
region_risk = np.array([COUNTRY_RISK[c] for c in country])

data_access = rng.choice(["No Access", "Limited", "Full"], N, p=[.35, .40, .25])
criticality = rng.choice(["Low", "Medium", "High"], N, p=[.45, .35, .20])

financial_health = np.clip(rng.normal(72, 14, N), 20, 100).round(1)
compliance_incidents = np.clip(rng.poisson(0.35, N), 0, 6)
sla_breaches = np.clip(rng.poisson(0.6, N), 0, 10)
on_time_rate = np.clip(rng.normal(0.94, 0.06, N), 0.55, 1.0).round(3)
security_cert = rng.choice(["Not Certified", "SOC2", "ISO27001", "Both"], N, p=[.30, .30, .20, .20])
subcontractor = rng.choice(["Yes", "No"], N, p=[.28, .72])
insurance_adequate = rng.choice(["Yes", "No"], N, p=[.88, .12])
sanctions_flag = rng.choice(["Clear", "Flagged"], N, p=[.975, .025])
last_assessment_days = np.clip(rng.exponential(220, N), 5, 1400).round().astype(int)

annual_spend = np.clip(rng.lognormal(11.2, 1.15, N), 8000, 9_000_000).round(-2)
contract_value = (annual_spend * np.clip(rng.normal(2.3, 0.8, N), 0.5, 6)).round(-2)
relationship_years = np.clip(rng.exponential(4.2, N), 0.2, 22).round(1)

cert_risk_map = {"Not Certified": 1.5, "SOC2": 0.5, "ISO27001": 0.5, "Both": 0.0}
region_risk_map = {"Low": 0.0, "Medium": 1.0, "High": 2.5}
access_risk_map = {"No Access": 0.0, "Limited": 1.0, "Full": 2.0}
crit_risk_map = {"Low": 0.0, "Medium": 1.0, "High": 2.0}

score = (
    np.array([access_risk_map[x] for x in data_access])
    + np.array([crit_risk_map[x] for x in criticality])
    - 0.03 * (financial_health - 70)
    + 0.9 * compliance_incidents
    + 0.5 * sla_breaches
    - 6.0 * (on_time_rate - 0.9)
    + np.array([cert_risk_map[x] for x in security_cert])
    + np.array([region_risk_map[x] for x in region_risk])
    + np.where(sanctions_flag == "Flagged", 4.0, 0.0)
    + np.where(subcontractor == "Yes", 1.0, 0.0)
    + np.where(insurance_adequate == "No", 1.5, 0.0)
    + 0.0015 * last_assessment_days
    + rng.normal(0, 1.0, N)
)

q55, q85 = np.quantile(score, [0.55, 0.85])
tier = np.where(score <= q55, "Low", np.where(score <= q85, "Medium", "High"))

vendor_prefixes = ["Apex","Summit","Vertex","Nova","Pinnacle","Meridian","Atlas","Horizon",
                    "Sterling","Cascade","Ironwood","Brightline","Northgate","Vantage","Anchor",
                    "Crestview","Beacon","Fulcrum","Keystone","Lighthouse","Momentum","Outpost",
                    "Redwood","Silverline","Trailhead","Union","Waypoint","Zenith","Bridgeline","Clearway"]
vendor_suffixes = ["Solutions","Group","Partners","Systems","Logistics","Technologies","Holdings",
                    "Global","Networks","Industries","Consulting","Labs","Dynamics","Enterprises","Co."]
vendor_name = [f"{rng.choice(vendor_prefixes)} {rng.choice(vendor_suffixes)}" for _ in range(N)]
# ensure rough uniqueness by appending a short id where needed
seen = {}
final_names = []
for nm in vendor_name:
    seen[nm] = seen.get(nm, 0) + 1
    final_names.append(nm if seen[nm] == 1 else f"{nm} {seen[nm]}")

df = pd.DataFrame({
    "vendor_id": [f"VEN{20000+i}" for i in range(N)],
    "vendor_name": final_names,
    "industry": industry,
    "country": country,
    "region_risk": region_risk,
    "annual_spend_usd": annual_spend,
    "contract_value_usd": contract_value,
    "relationship_years": relationship_years,
    "data_access_level": data_access,
    "business_criticality": criticality,
    "financial_health_score": financial_health,
    "security_certification": security_cert,
    "compliance_incidents_3yr": compliance_incidents,
    "sla_breach_count_1yr": sla_breaches,
    "on_time_delivery_rate": on_time_rate,
    "subcontractor_use": subcontractor,
    "insurance_adequate": insurance_adequate,
    "sanctions_screening": sanctions_flag,
    "last_assessment_days_ago": last_assessment_days,
    "risk_tier": tier,
})

# light realistic missingness
miss_idx = rng.choice(N, size=int(N * 0.02), replace=False)
df.loc[miss_idx, "financial_health_score"] = np.nan

df.to_csv("/home/claude/vendor_risk_project/data/vendors.csv", index=False)
print(df.shape)
print(df["risk_tier"].value_counts())
print(df["risk_tier"].value_counts(normalize=True).round(3))
