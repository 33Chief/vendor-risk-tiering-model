const pptxgen = require("pptxgenjs");

const NAVY = "1E2761";
const NAVY_DARK = "141A47";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const TEXT = "1A1A2E";
const MUTED = "5B6270";
const GREEN = "2F6B1F";
const AMBER = "8A5A0B";
const RED = "8C2A2A";
const LIGHT_BG = "F7F8FB";
const CARD_BORDER = "E1E4EC";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

const FONT = "Calibri";
const FONT_HEAD = "Cambria";

function addFooter(slide, pageNum) {
  slide.addText("Quarterly Vendor Risk Review  \u2014  Confidential (Synthetic Data)", {
    x: 0.5, y: 7.15, w: 8, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, isTextBox: true, margin: 0,
  });
  slide.addText(String(pageNum), {
    x: 12.6, y: 7.15, w: 0.5, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, align: "right", isTextBox: true, margin: 0,
  });
}

// ================= SLIDE 1: TITLE =================
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };
  s.addShape("rect", { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY_DARK } });

  s.addText("QUARTERLY VENDOR RISK REVIEW", {
    x: 0.9, y: 2.55, w: 11.5, h: 1.1, fontFace: FONT_HEAD, fontSize: 40, bold: true, color: WHITE, isTextBox: true, margin: 0,
  });
  s.addText("Third-Party Vendor Risk Tiering  \u2014  Q3 2026", {
    x: 0.9, y: 3.55, w: 11, h: 0.6, fontFace: FONT, fontSize: 20, color: ICE, isTextBox: true, margin: 0,
  });
  s.addText("Prepared by Malcolm Riley  |  Vendor Risk Management", {
    x: 0.9, y: 4.75, w: 10, h: 0.4, fontFace: FONT, fontSize: 13, italic: true, color: "9AAAD6", isTextBox: true, margin: 0,
  });
  s.addText("All vendor data is synthetically generated for portfolio demonstration purposes.", {
    x: 0.9, y: 6.85, w: 10, h: 0.3, fontFace: FONT, fontSize: 9, italic: true, color: "6B76A8", isTextBox: true, margin: 0,
  });
}

// ================= SLIDE 2: EXECUTIVE SUMMARY =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Executive Summary", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("520 vendors scored by the Vendor Risk Tiering Model this quarter", { x: 0.6, y: 1.0, w: 10, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  const cards = [
    { big: "520", label: "Vendors Assessed", sub: "Full active vendor population", color: NAVY },
    { big: "71", label: "High-Risk Vendors", sub: "13.7% of population", color: RED },
    { big: "$9.4M", label: "High-Risk Spend", sub: "11.8% of total annual spend", color: RED },
    { big: "37", label: "Control Gaps", sub: "Full data access, no certification", color: AMBER },
  ];
  const cardW = 2.9, gap = 0.25, startX = 0.6, y = 1.65, h = 1.9;
  cards.forEach((c, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape("roundRect", { x, y, w: cardW, h, rectRadius: 0.08, fill: { color: LIGHT_BG }, line: { color: CARD_BORDER, width: 1 } });
    s.addText(c.big, { x: x + 0.2, y: y + 0.2, w: cardW - 0.4, h: 0.75, fontFace: FONT_HEAD, fontSize: 36, bold: true, color: c.color, isTextBox: true, margin: 0 });
    s.addText(c.label, { x: x + 0.2, y: y + 0.98, w: cardW - 0.4, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: TEXT, isTextBox: true, margin: 0 });
    s.addText(c.sub, { x: x + 0.2, y: y + 1.38, w: cardW - 0.4, h: 0.45, fontFace: FONT, fontSize: 10.5, color: MUTED, isTextBox: true, margin: 0 });
  });

  s.addText("Key finding", { x: 0.6, y: 3.85, w: 4, h: 0.35, fontFace: FONT, fontSize: 14, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText(
    "High-risk vendors represent 13.7% of the population but only 11.8% of spend \u2014 risk is concentrated in specific relationships, not broad spend exposure. 95 vendors (including 21 already High-tier) are overdue for reassessment (>365 days since last review), and 37 vendors combine full data access with no independent security certification \u2014 a control gap requiring remediation.",
    { x: 0.6, y: 4.2, w: 11.9, h: 1.3, fontFace: FONT, fontSize: 13, color: TEXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.25 }
  );

  s.addText("What's inside this review", { x: 0.6, y: 5.55, w: 4, h: 0.3, fontFace: FONT, fontSize: 14, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  const items = ["Model methodology & performance", "Risk distribution across the vendor book", "Top high-risk vendors & required actions", "Industry-level concentration", "Recommendations & remediation timeline"];
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: i < items.length - 1, color: TEXT, fontSize: 11.5 } })),
    { x: 0.8, y: 5.92, w: 11, h: 1.15, fontFace: FONT, isTextBox: true, margin: 0, paraSpaceAfter: 2 });

  addFooter(s, 2);
}

// ================= SLIDE 3: METHODOLOGY =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Methodology", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("How each vendor's risk tier is generated", { x: 0.6, y: 1.0, w: 10, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  const steps = [
    { n: "1", t: "Data Collection", d: "16 attributes per vendor: spend & contract value, data access level, business criticality, financial health, compliance/SLA history, security certification, geography, and due-diligence recency." },
    { n: "2", t: "Model Training", d: "Random Forest classifier (300 trees) trained on 390 vendors, validated on a 130-vendor holdout set never seen during training." },
    { n: "3", t: "Risk Tiering", d: "Each vendor scored into Low / Medium / High tier, plus a continuous 0\u2013100 risk score blended from the model's class probabilities." },
    { n: "4", t: "Validation", d: "69.2% holdout accuracy; AUC of 0.87 (Low), 0.73 (Medium), 0.85 (High) \u2014 the model is most confident distinguishing clear Low and High risk vendors." },
  ];
  const rowH = 1.15, startY = 1.65;
  steps.forEach((st, i) => {
    const y = startY + i * rowH;
    s.addShape("ellipse", { x: 0.6, y: y + 0.05, w: 0.55, h: 0.55, fill: { color: NAVY }, line: { type: "none" } });
    s.addText(st.n, { x: 0.6, y: y + 0.05, w: 0.55, h: 0.55, fontFace: FONT_HEAD, fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(st.t, { x: 1.35, y: y, w: 3.2, h: 0.6, fontFace: FONT, fontSize: 15, bold: true, color: TEXT, valign: "middle", isTextBox: true, margin: 0 });
    s.addText(st.d, { x: 4.55, y: y, w: 8.1, h: 0.95, fontFace: FONT, fontSize: 12, color: MUTED, valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
  });

  addFooter(s, 3);
}

// ================= SLIDE 4: RISK DISTRIBUTION (charts) =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Risk Distribution", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("Vendor count and spend concentration across the three risk tiers", { x: 0.6, y: 1.0, w: 11, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  const tierColors = [GREEN, AMBER, RED];
  const catAxisOpts = { catAxisLabelColor: MUTED, catAxisLabelFontSize: 11, catGridLine: { style: "none" } };
  const valAxisOpts = { valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valGridLine: { color: "E7E9EF", size: 0.75 } };

  s.addChart("bar", [{ name: "Vendor Count", labels: ["Low", "Medium", "High"], values: [302, 147, 71] }], {
    x: 0.6, y: 1.6, w: 5.9, h: 4.9,
    showTitle: true, title: "Vendor Count by Tier", titleFontFace: FONT, titleFontSize: 14, titleColor: TEXT,
    showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: TEXT,
    chartColors: tierColors, barGapWidthPct: 40,
    ...catAxisOpts, ...valAxisOpts,
  });

  s.addChart("bar", [{ name: "Annual Spend ($M)", labels: ["Low", "Medium", "High"], values: [52.48, 18.05, 9.40] }], {
    x: 6.8, y: 1.6, w: 5.9, h: 4.9,
    showTitle: true, title: "Annual Spend by Tier ($M)", titleFontFace: FONT, titleFontSize: 14, titleColor: TEXT,
    showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: TEXT, dataLabelFormatCode: '"$"0.0"M"',
    chartColors: tierColors, barGapWidthPct: 40,
    ...catAxisOpts, ...valAxisOpts,
  });

  addFooter(s, 4);
}

// ================= SLIDE 5: MODEL PERFORMANCE =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Model Performance", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("Holdout test set \u2014 130 vendors never seen during training", { x: 0.6, y: 1.0, w: 11, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  // left: metric cards
  const metrics = [
    { label: "Overall Accuracy", val: "69.2%" },
    { label: "AUC \u2014 Low tier", val: "0.869" },
    { label: "AUC \u2014 Medium tier", val: "0.729" },
    { label: "AUC \u2014 High tier", val: "0.848" },
  ];
  metrics.forEach((m, i) => {
    const y = 1.65 + i * 0.92;
    s.addShape("roundRect", { x: 0.6, y, w: 4.6, h: 0.75, rectRadius: 0.06, fill: { color: LIGHT_BG }, line: { color: CARD_BORDER, width: 1 } });
    s.addText(m.label, { x: 0.85, y, w: 3.0, h: 0.75, fontFace: FONT, fontSize: 13, color: TEXT, valign: "middle", isTextBox: true, margin: 0 });
    s.addText(m.val, { x: 3.7, y, w: 1.4, h: 0.75, fontFace: FONT_HEAD, fontSize: 18, bold: true, color: NAVY, valign: "middle", align: "right", isTextBox: true, margin: 0 });
  });

  // right: confusion matrix as native table
  s.addText("Confusion Matrix (Actual \u2192 rows, Predicted \u2192 columns)", { x: 5.6, y: 1.55, w: 7.0, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: TEXT, isTextBox: true, margin: 0 });
  const cmRows = [
    [{ text: "", options: { fill: { color: WHITE } } }, { text: "Low", options: { fill: { color: NAVY }, color: WHITE, bold: true } }, { text: "Medium", options: { fill: { color: NAVY }, color: WHITE, bold: true } }, { text: "High", options: { fill: { color: NAVY }, color: WHITE, bold: true } }],
    [{ text: "Low", options: { fill: { color: NAVY }, color: WHITE, bold: true } }, "64", "5", "2"],
    [{ text: "Medium", options: { fill: { color: NAVY }, color: WHITE, bold: true } }, "18", "18", "3"],
    [{ text: "High", options: { fill: { color: NAVY }, color: WHITE, bold: true } }, "5", "7", "8"],
  ];
  s.addTable(cmRows, {
    x: 5.6, y: 1.95, w: 7.0, h: 1.9, fontFace: FONT, fontSize: 13, align: "center", valign: "middle",
    border: { type: "solid", color: CARD_BORDER, pt: 1 }, autoPage: false,
  });

  s.addShape("roundRect", { x: 5.6, y: 4.1, w: 7.0, h: 2.4, rectRadius: 0.06, fill: { color: "FBF3E7" }, line: { color: "E8D5B5", width: 1 } });
  s.addText("Finding: Medium tier is hardest to classify", { x: 5.85, y: 4.3, w: 6.5, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: AMBER, isTextBox: true, margin: 0 });
  s.addText(
    "18 of 39 actual Medium-tier vendors (46%) were predicted as Low. This is a common pattern in ordinal risk tiering \u2014 the model is confident at the extremes but less precise at the boundary. Recommend routing model-predicted Medium-tier vendors through a lightweight analyst review rather than fully automating that tier.",
    { x: 5.85, y: 4.75, w: 6.5, h: 1.6, fontFace: FONT, fontSize: 12, color: TEXT, isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );

  addFooter(s, 5);
}

// ================= SLIDE 6: TOP HIGH-RISK VENDORS =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Top High-Risk Vendors", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("Highest risk-scored vendors this quarter, with required actions", { x: 0.6, y: 1.0, w: 11, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  const headerOpt = { fill: { color: NAVY }, color: WHITE, bold: true, fontSize: 11 };
  const rows = [
    [
      { text: "Vendor", options: headerOpt }, { text: "Industry", options: headerOpt },
      { text: "Score", options: headerOpt }, { text: "Key Flag", options: headerOpt },
      { text: "Recommended Action", options: headerOpt },
    ],
    ["Trailhead Co.", "Marketing & Media", "88.0", "Overdue 394 days", "Reassess \u2014 overdue >365 days"],
    ["Lighthouse Holdings", "Financial Services", "86.2", "Overdue 420 days", "Reassess \u2014 overdue >365 days"],
    ["Horizon Technologies 3", "Financial Services", "85.9", "Not certified", "Standard High-tier monitoring"],
    ["Lighthouse Co.", "Financial Services", "85.3", "Full access, not certified", "Remediate control gap"],
    ["Sterling Logistics 3", "Manufacturing", "85.3", "\u2014", "Standard High-tier monitoring"],
    ["Momentum Systems", "Payment Processing", "84.7", "Sanctions flagged", "Escalate to Compliance"],
  ].map((r, i) => i === 0 ? r : r.map((c, j) => ({ text: c, options: { fontSize: 11.5, color: j === 3 && (c.includes("Sanctions") || c.includes("Overdue") || c.includes("Full access")) ? RED : TEXT, bold: j === 3 } } )));

  s.addTable(rows, {
    x: 0.6, y: 1.55, w: 12.1, h: 3.7, fontFace: FONT, valign: "middle",
    border: { type: "solid", color: CARD_BORDER, pt: 1 },
    colW: [2.6, 2.4, 1.1, 2.6, 3.4],
    autoPage: false,
  });

  s.addShape("roundRect", { x: 0.6, y: 5.55, w: 12.1, h: 1.1, rectRadius: 0.06, fill: { color: LIGHT_BG }, line: { color: CARD_BORDER, width: 1 } });
  s.addText(
    "These 6 vendors represent $500K+ in combined annual spend and are prioritized for the current remediation cycle. Full detail for all 71 High-tier vendors is available in the Vendor Risk Scorecard workbook.",
    { x: 0.85, y: 5.55, w: 11.6, h: 1.1, fontFace: FONT, fontSize: 12, color: TEXT, valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.2 }
  );

  addFooter(s, 6);
}

// ================= SLIDE 7: INDUSTRY CONCENTRATION =================
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Industry Risk Concentration", { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: NAVY, isTextBox: true, margin: 0 });
  s.addText("Share of vendors classified High-risk, by industry category", { x: 0.6, y: 1.0, w: 11, h: 0.35, fontFace: FONT, fontSize: 14, color: MUTED, isTextBox: true, margin: 0 });

  const industries = ["Financial Services", "IT Services", "Manufacturing", "Staffing", "Facilities & Maint.", "Cloud/SaaS"];
  const pctHigh = [31.1, 16.3, 15.1, 14.3, 12.5, 12.3];

  s.addChart("bar", [{ name: "% High Risk", labels: industries, values: pctHigh }], {
    x: 0.6, y: 1.55, w: 12.1, h: 4.6, barDir: "bar",
    showTitle: false, showLegend: false, showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: TEXT,
    dataLabelFormatCode: '0.0"%"',
    chartColors: [RED], barGapWidthPct: 35,
    catAxisLabelColor: TEXT, catAxisLabelFontSize: 12,
    valAxisLabelColor: MUTED, valAxisLabelFontSize: 10, valGridLine: { color: "E7E9EF", size: 0.75 },
    valAxisMinVal: 0, valAxisMaxVal: 36,
  });

  s.addText("Financial Services vendors are nearly 2x more likely to be High-risk than the next closest category \u2014 driven by elevated business criticality and data access levels typical of the category.", {
    x: 0.6, y: 6.35, w: 12.1, h: 0.6, fontFace: FONT, fontSize: 12, italic: true, color: MUTED, isTextBox: true, margin: 0,
  });

  addFooter(s, 7);
}

// ================= SLIDE 8: RECOMMENDATIONS =================
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };
  s.addText("Recommendations & Next Steps", { x: 0.6, y: 0.5, w: 11, h: 0.6, fontFace: FONT_HEAD, fontSize: 30, bold: true, color: WHITE, isTextBox: true, margin: 0 });

  const recs = [
    { t: "Remediate control gaps", d: "37 vendors combine full data access with no security certification. Require SOC2/ISO27001 or reduce access within 90 days." },
    { t: "Clear the reassessment backlog", d: "95 vendors are overdue for reassessment (>365 days). Prioritize the 21 already in the High tier first." },
    { t: "Escalate flagged vendors now", d: "12 sanctions-flagged and 28 multi-incident vendors should route to Compliance/Legal this week, independent of tier." },
    { t: "Add a Medium-tier review queue", d: "Given weaker model precision on Medium-tier predictions, route these to a lightweight analyst check rather than full automation." },
    { t: "Target Financial Services vendors", d: "This category carries the highest High-risk concentration (31.1%) \u2014 candidate for a category-level policy update." },
  ];
  const startY = 1.5, rowH = 1.05;
  recs.forEach((r, i) => {
    const y = startY + i * rowH;
    s.addShape("roundRect", { x: 0.6, y, w: 0.45, h: 0.45, rectRadius: 0.06, fill: { color: ICE }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 0.6, y, w: 0.45, h: 0.45, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: NAVY_DARK, align: "center", valign: "middle", isTextBox: true, margin: 0 });
    s.addText(r.t, { x: 1.25, y: y - 0.05, w: 3.7, h: 0.55, fontFace: FONT, fontSize: 14, bold: true, color: WHITE, valign: "middle", isTextBox: true, margin: 0 });
    s.addText(r.d, { x: 5.05, y: y - 0.05, w: 7.6, h: 0.85, fontFace: FONT, fontSize: 12, color: "C7CEE8", valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
  });

  addFooter(s, 8);
}

pres.writeFile({ fileName: "/home/claude/vendor_risk_project/outputs/Vendor_Risk_Review_Q3_2026.pptx" }).then(() => console.log("written"));
