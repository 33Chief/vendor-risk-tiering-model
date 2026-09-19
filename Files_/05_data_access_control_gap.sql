-- Query 5: Control gap - vendors with full data access but weak/no security certification
-- Business use: a classic vendor security control gap - flags vendors that can
-- see sensitive data but haven't demonstrated independent security assurance.
SELECT
    vendor_id,
    vendor_name,
    industry,
    data_access_level,
    security_certification,
    predicted_tier,
    risk_score_0_100
FROM vendors
WHERE data_access_level = 'Full'
  AND security_certification = 'Not Certified'
ORDER BY risk_score_0_100 DESC;
