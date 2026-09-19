-- Query 1: High/Medium risk vendors overdue for reassessment (due diligence refresh)
-- Business use: due-diligence teams prioritize re-screening by risk + staleness.
SELECT
    vendor_id,
    vendor_name,
    industry,
    predicted_tier,
    risk_score_0_100,
    last_assessment_days_ago,
    ROUND(annual_spend_usd, 0) AS annual_spend_usd
FROM vendors
WHERE predicted_tier IN ('High', 'Medium')
  AND last_assessment_days_ago > 365
ORDER BY risk_score_0_100 DESC, last_assessment_days_ago DESC
LIMIT 25;
