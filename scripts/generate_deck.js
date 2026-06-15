const pptxgen = require("pptxgenjs");

// ── THEME ──────────────────────────────────────────────────────────────────
const C = {
  dark:    "0A1628",   // deep navy
  mid:     "0E3460",   // mid navy
  accent:  "1B9AAA",   // teal accent
  accent2: "0D9488",   // teal-green
  light:   "E8F4F8",   // pale blue-white
  white:   "FFFFFF",
  muted:   "94A3B8",
  text:    "1E293B",
  green:   "059669",
  gold:    "D97706",
};

function makeShadow(opacity = 0.14) {
  return { type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity };
}

function statCard(slide, x, y, w, h, value, label, color) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.dark },
    shadow: makeShadow(0.2),
    rectRadius: 0.08,
  });
  slide.addText(value, {
    x: x + 0.12, y: y + 0.12, w: w - 0.24, h: h * 0.55,
    fontSize: 28, bold: true, color: color || C.accent,
    align: "center", valign: "middle", margin: 0,
  });
  slide.addText(label, {
    x: x + 0.1, y: y + h * 0.62, w: w - 0.2, h: h * 0.32,
    fontSize: 9.5, color: C.muted,
    align: "center", valign: "top", margin: 0, wrap: true,
  });
}

function sectionCard(slide, x, y, w, h, title, body, iconChar) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: C.white },
    shadow: makeShadow(0.12),
    rectRadius: 0.08,
  });
  // circle for icon
  slide.addShape("ellipse", {
    x: x + 0.18, y: y + 0.15, w: 0.44, h: 0.44,
    fill: { color: C.accent },
  });
  slide.addText(iconChar, {
    x: x + 0.18, y: y + 0.15, w: 0.44, h: 0.44,
    fontSize: 18, color: C.white, align: "center", valign: "middle", margin: 0, bold: true,
  });
  slide.addText(title, {
    x: x + 0.72, y: y + 0.18, w: w - 0.82, h: 0.38,
    fontSize: 12, bold: true, color: C.dark, margin: 0,
  });
  slide.addText(body, {
    x: x + 0.18, y: y + 0.7, w: w - 0.3, h: h - 0.82,
    fontSize: 10.5, color: "475569", margin: 0, wrap: true,
  });
}

async function buildDeck() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.3" × 7.5"
  pres.title = "Placebo Academic Repository – Pitch Deck";

  // SLIDE 1 – COVER
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: 9.8, y: -1.5, w: 5, h: 5, fill: { color: C.accent, transparency: 82 } });
    s.addShape("ellipse", { x: 10.6, y: -0.4, w: 2.8, h: 2.8, fill: { color: C.accent, transparency: 70 } });

    s.addShape("ellipse", { x: -0.8, y: 5.5, w: 3.5, h: 3.5, fill: { color: C.accent2, transparency: 85 } });

    s.addShape("rect", { x: 0.5, y: 0.55, w: 0.06, h: 1.3, fill: { color: C.accent } });
    s.addText("PLACEBO", {
      x: 0.7, y: 0.55, w: 5, h: 0.55,
      fontSize: 28, bold: true, color: C.white, margin: 0, charSpacing: 6,
    });
    s.addText("EDUCATION SOLUTIONS", {
      x: 0.7, y: 1.05, w: 5, h: 0.35,
      fontSize: 11, color: C.accent, margin: 0, charSpacing: 4,
    });

    s.addText("The Most Comprehensive\nAcademic Knowledge Repository", {
      x: 0.5, y: 2.05, w: 8.5, h: 1.6,
      fontSize: 38, bold: true, color: C.white, margin: 0,
      align: "left",
    });
    s.addText("for Medical & Pharmacy Education", {
      x: 0.5, y: 3.6, w: 8.5, h: 0.65,
      fontSize: 26, color: C.accent, margin: 0,
    });

    s.addShape("rect", { x: 0.5, y: 4.45, w: 4, h: 0.04, fill: { color: C.accent, transparency: 30 } });

    s.addText("Prepared by Placebo Education Solutions   ·   June 2026", {
      x: 0.5, y: 4.65, w: 8, h: 0.35,
      fontSize: 11, color: C.muted, margin: 0,
    });
    s.addText("Strictly Private & Confidential", {
      x: 0.5, y: 5.05, w: 8, h: 0.3,
      fontSize: 10, color: "475569", margin: 0, italic: true,
    });

    s.addText("350+", { x: 9.8, y: 1.6, w: 3.2, h: 0.9, fontSize: 48, bold: true, color: C.accent, align: "center", margin: 0 });
    s.addText("PDFs Ingested", { x: 9.8, y: 2.45, w: 3.2, h: 0.32, fontSize: 12, color: C.muted, align: "center", margin: 0 });

    s.addText("250K+", { x: 9.8, y: 3.1, w: 3.2, h: 0.9, fontSize: 48, bold: true, color: C.accent2, align: "center", margin: 0 });
    s.addText("Pages Analyzed", { x: 9.8, y: 3.95, w: 3.2, h: 0.32, fontSize: 12, color: C.muted, align: "center", margin: 0 });

    s.addText("1.2M+", { x: 9.8, y: 4.6, w: 3.2, h: 0.9, fontSize: 48, bold: true, color: C.gold, align: "center", margin: 0 });
    s.addText("Academic References", { x: 9.8, y: 5.45, w: 3.2, h: 0.32, fontSize: 12, color: C.muted, align: "center", margin: 0 });

    s.addNotes("Welcome slide. Introduce the platform and highlight the scale of the repository.");
  }

  // SLIDE 2 – INDUSTRY CHALLENGE
  {
    const s = pres.addSlide();
    s.background = { color: "F8FAFC" };

    s.addShape("rect", { x: 0, y: 0, w: 13.3, h: 1.05, fill: { color: C.dark } });
    s.addText("THE INDUSTRY CHALLENGE", {
      x: 0.5, y: 0.15, w: 10, h: 0.7,
      fontSize: 26, bold: true, color: C.white, margin: 0,
    });
    s.addText("PROBLEM STATEMENT", {
      x: 10, y: 0.28, w: 3, h: 0.45,
      fontSize: 11, color: C.accent, align: "right", margin: 0, charSpacing: 2,
    });

    s.addText("Medical & Pharmacy students are drowning in data — but starved for accessible knowledge.", {
      x: 0.5, y: 1.25, w: 12.3, h: 0.5,
      fontSize: 15, color: "475569", italic: true, margin: 0,
    });

    const pains = [
      { icon: "📚", title: "Fragmented Materials", body: "Study resources scattered across dozens of physical books and unconnected digital formats, with no unified access point." },
      { icon: "🔍", title: "Low Search Efficiency", body: "Hours spent flipping through 1,000-page textbooks to find a single clinical definition or dosage chart." },
      { icon: "⚠️", title: "Unverified Notes", body: "Students increasingly rely on scattered, unvetted notes rather than peer-reviewed standard textbooks." },
      { icon: "💰", title: "High Institutional Cost", body: "Institutions pay significant overheads for fragmented digital library subscriptions with low utilization rates." },
      { icon: "📉", title: "Academic Inconsistency", body: "Different students access different quality resources, creating unequal academic baselines across the cohort." },
      { icon: "⏰", title: "Wasted Faculty Time", body: "Educators spend excessive hours gathering authoritative materials for curriculum planning and lecture preparation." },
    ];

    const cols = 3, rows = 2;
    const cw = 3.95, ch = 1.6;
    const xStart = 0.4, yStart = 2.0;
    pains.forEach((p, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = xStart + col * (cw + 0.24);
      const y = yStart + row * (ch + 0.22);
      sectionCard(s, x, y, cw, ch, p.title, p.body, p.icon);
    });

    s.addNotes("Describe how medical education suffers from information overload and fragmented access to quality resources.");
  }

  // SLIDE 3 – SOLUTION OVERVIEW
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: 9.5, y: -2, w: 7, h: 7, fill: { color: C.accent, transparency: 88 } });

    s.addText("OUR SOLUTION", {
      x: 0.55, y: 0.45, w: 6, h: 0.38,
      fontSize: 12, color: C.accent, margin: 0, charSpacing: 4, bold: true,
    });
    s.addText("The Placebo Academic Repository", {
      x: 0.55, y: 0.82, w: 9, h: 1.1,
      fontSize: 36, bold: true, color: C.white, margin: 0,
    });
    s.addText("A singular, institutional-grade knowledge platform that transforms how medical sciences are studied.", {
      x: 0.55, y: 1.95, w: 8.5, h: 0.5,
      fontSize: 14, color: C.muted, margin: 0,
    });

    const features = [
      { num: "01", title: "Centralized Knowledge", body: "Every standard textbook, reference manual, and clinical guide in one unified platform." },
      { num: "02", title: "Curriculum-Aligned", body: "Content mapped to University and Medical Council syllabi — semester by semester." },
      { num: "03", title: "Instant Retrieval", body: "Find the exact page, diagram, or clinical definition in seconds, not hours." },
      { num: "04", title: "Gold-Standard Sources", body: "Exclusively peer-reviewed, globally mandated textbooks — zero unverified content." },
    ];

    features.forEach((f, i) => {
      const x = 0.4 + (i % 2) * 6.3;
      const y = 2.7 + Math.floor(i / 2) * 2.05;
      s.addShape("rect", {
        x, y, w: 5.9, h: 1.82,
        fill: { color: C.mid },
        shadow: makeShadow(0.25),
        rectRadius: 0.1,
      });
      s.addText(f.num, { x: x + 0.18, y: y + 0.18, w: 0.7, h: 0.55, fontSize: 24, bold: true, color: C.accent, margin: 0 });
      s.addText(f.title, { x: x + 0.95, y: y + 0.2, w: 4.7, h: 0.45, fontSize: 14, bold: true, color: C.white, margin: 0 });
      s.addText(f.body, { x: x + 0.95, y: y + 0.68, w: 4.65, h: 0.9, fontSize: 11, color: C.muted, margin: 0, wrap: true });
    });

    s.addNotes("Walk through the four core pillars of the Placebo platform solution.");
  }

  // SLIDE 4 – PLATFORM SCALE (BIG NUMBERS)
  {
    const s = pres.addSlide();
    s.background = { color: "F1F5F9" };

    s.addShape("rect", { x: 0, y: 0, w: 13.3, h: 1.05, fill: { color: C.dark } });
    s.addText("PLATFORM SCALE", { x: 0.5, y: 0.15, w: 8, h: 0.7, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText("COMBINED REPOSITORY", { x: 8.5, y: 0.28, w: 4.3, h: 0.45, fontSize: 11, color: C.accent, align: "right", margin: 0, charSpacing: 2 });

    s.addText("The ultimate healthcare education platform — MBBS + Pharmacy, unified under one roof.", {
      x: 0.5, y: 1.18, w: 12.3, h: 0.42,
      fontSize: 14, color: "475569", italic: true, margin: 0,
    });

    const stats = [
      { val: "34",     label: "Total Subjects\nCovered",         color: C.accent  },
      { val: "520",    label: "Total PDFs\nIngested",            color: C.accent2  },
      { val: "346K+",  label: "Total Pages\nAnalyzed",          color: C.gold    },
      { val: "49.3 GB",label: "Total Content\nSize",            color: "A78BFA"  },
      { val: "1.2M+",  label: "Academic\nReferences",           color: C.green   },
      { val: "250K+",  label: "Data Points\nIndexed",           color: "F472B6"  },
    ];

    stats.forEach((st, i) => {
      const x = 0.4 + (i % 3) * 4.18;
      const y = 1.88 + Math.floor(i / 3) * 2.35;
      statCard(s, x, y, 3.88, 2.08, st.val, st.label, st.color);
    });

    s.addNotes("Emphasize the sheer scale of the content repository and what it means for institutional purchasing.");
  }

  // SLIDE 5 – MBBS CURRICULUM COVERAGE
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: -1, y: -1.2, w: 5, h: 5, fill: { color: C.accent, transparency: 90 } });

    s.addText("MBBS CURRICULUM COVERAGE", {
      x: 0.5, y: 0.35, w: 9, h: 0.4,
      fontSize: 12, color: C.accent, margin: 0, charSpacing: 4, bold: true,
    });
    s.addText("19 Subjects · 324 PDFs · 211,050 Pages · 31.5 GB", {
      x: 0.5, y: 0.78, w: 10, h: 0.55,
      fontSize: 28, bold: true, color: C.white, margin: 0,
    });

    const phases = [
      { phase: "Pre-Clinical", pages: "38,450", color: C.accent },
      { phase: "Para-Clinical", pages: "42,000", color: C.accent2 },
      { phase: "Clinical", pages: "130,600", color: C.gold },
    ];
    phases.forEach((p, i) => {
      const x = 0.4 + i * 4.27;
      s.addShape("rect", {
        x, y: 1.55, w: 3.95, h: 1.1,
        fill: { color: C.mid },
        rectRadius: 0.08,
      });
      s.addText(p.pages, { x: x + 0.12, y: 1.6, w: 3.7, h: 0.55, fontSize: 26, bold: true, color: p.color, align: "center", margin: 0 });
      s.addText(p.phase + " Pages", { x: x + 0.12, y: 2.12, w: 3.7, h: 0.32, fontSize: 10, color: C.muted, align: "center", margin: 0 });
    });

    s.addChart(pres.charts.PIE, [{
      name: "Phase Distribution",
      labels: ["Pre-Clinical (18%)", "Para-Clinical (20%)", "Clinical (62%)"],
      values: [18, 20, 62],
    }], {
      x: 0.3, y: 2.85, w: 4.5, h: 4.3,
      chartColors: [C.accent, C.accent2, C.gold],
      chartArea: { fill: { color: C.dark } },
      showLegend: true, legendPos: "b",
      legendFontColor: C.muted, legendFontSize: 9,
      showPercent: true, dataLabelColor: C.white, dataLabelFontSize: 10,
    });

    const subjects = [
      ["Subject", "PDFs", "Pages"],
      ["Anatomy", "25", "15,200"],
      ["Physiology", "18", "12,450"],
      ["Biochemistry", "15", "10,800"],
      ["Pathology", "22", "16,500"],
      ["Pharmacology", "20", "14,200"],
      ["General Medicine", "30", "22,000"],
      ["General Surgery", "28", "20,500"],
      ["OB & Gynecology", "20", "15,600"],
      ["Pediatrics", "18", "13,400"],
    ];
    const tData = subjects.map((row, ri) =>
      row.map((cell, ci) => ({
        text: cell,
        options: {
          bold: ri === 0,
          color: ri === 0 ? C.white : (ci === 0 ? "CBD5E1" : C.muted),
          fill: { color: ri === 0 ? C.accent : (ri % 2 === 0 ? "0B2545" : C.mid) },
          fontSize: ri === 0 ? 10 : 9.5,
          align: ci === 0 ? "left" : "center",
        },
      }))
    );
    s.addTable(tData, {
      x: 5.0, y: 2.85, w: 7.9, h: 4.3,
      colW: [3.6, 1.8, 2.5],
      border: { pt: 0.5, color: "1E3A5F" },
      rowH: 0.42,
    });

    s.addNotes("Highlight the breadth and depth of the MBBS curriculum, especially the clinical phase dominance.");
  }

  // SLIDE 6 – PHARMACY CURRICULUM COVERAGE
  {
    const s = pres.addSlide();
    s.background = { color: "F1F5F9" };

    s.addShape("rect", { x: 0, y: 0, w: 13.3, h: 1.05, fill: { color: C.dark } });
    s.addText("PHARMACY CURRICULUM COVERAGE", { x: 0.5, y: 0.15, w: 9.5, h: 0.7, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText("PHARM.D & B.PHARM", { x: 9.8, y: 0.28, w: 3, h: 0.45, fontSize: 11, color: C.accent, align: "right", margin: 0, charSpacing: 2 });

    s.addText("15 Subjects · 196 PDFs · 135,500 Pages · 17.8 GB", {
      x: 0.5, y: 1.18, w: 12, h: 0.45,
      fontSize: 18, bold: true, color: C.dark, margin: 0,
    });

    s.addChart(pres.charts.BAR, [{
      name: "PDFs",
      labels: ["Pharmacology", "Pharmaceutics", "Medicinal Chem", "Clinical Pharm", "Pharm Analysis", "Pharmacognosy", "Anatomy & Phys", "Microbiology", "Biochemistry", "Biopharmaceu.", "Industrial Ph.", "Hospital Ph.", "Pharm. Jurisp.", "Pharmacovigi."],
      values: [22, 18, 16, 15, 14, 14, 12, 12, 10, 10, 12, 10, 8, 8],
    }], {
      x: 0.4, y: 1.82, w: 7.5, h: 4.4,
      barDir: "bar",
      chartColors: [C.accent],
      chartArea: { fill: { color: C.white }, roundedCorners: true },
      catAxisLabelColor: C.text, catAxisLabelFontSize: 8,
      valAxisLabelColor: "64748B",
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
      showValue: true, dataLabelFontSize: 8, dataLabelColor: C.text,
      showLegend: false,
      showTitle: true, title: "PDFs per Subject", titleColor: C.dark, titleFontSize: 11,
    });

    const pharmStats = [
      { val: "15", label: "Pharmacy\nDisciplines", color: C.accent },
      { val: "196", label: "Total PDFs\nIngested", color: C.accent2 },
      { val: "135K+", label: "Total Pages\nAnalyzed", color: C.gold },
      { val: "450K+", label: "Drug Interactions\n& Profiles Indexed", color: C.green },
    ];
    pharmStats.forEach((st, i) => {
      const x = 8.2;
      const y = 1.8 + i * 1.17;
      statCard(s, x, y, 4.7, 1.0, st.val, st.label, st.color);
    });

    s.addNotes("Highlight the pharmacy curriculum depth and the 450,000+ drug interactions indexed.");
  }

  // SLIDE 7 – TEXTBOOK COVERAGE
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: 10.5, y: 3.5, w: 4.5, h: 4.5, fill: { color: C.accent, transparency: 90 } });

    s.addText("TEXTBOOK COVERAGE", { x: 0.5, y: 0.35, w: 9, h: 0.4, fontSize: 12, color: C.accent, margin: 0, charSpacing: 4, bold: true });
    s.addText("Built on Gold-Standard Academic References", { x: 0.5, y: 0.78, w: 10, h: 0.6, fontSize: 30, bold: true, color: C.white, margin: 0 });
    s.addText("Zero reliance on unverified internet data. Every reference is globally mandated and peer-reviewed.", {
      x: 0.5, y: 1.45, w: 10.5, h: 0.4, fontSize: 13, color: C.muted, margin: 0,
    });

    s.addShape("rect", { x: 0.4, y: 2.05, w: 6.1, h: 4.9, fill: { color: C.mid }, rectRadius: 0.1 });
    s.addShape("rect", { x: 0.4, y: 2.05, w: 6.1, h: 0.5, fill: { color: C.accent }, rectRadius: 0.1 });
    s.addText("MBBS CORE REFERENCES", { x: 0.55, y: 2.1, w: 5.8, h: 0.38, fontSize: 12, bold: true, color: C.white, margin: 0 });

    const mbbsRefs = [
      ["Anatomy", "Gray's Anatomy, BD Chaurasia, AK Datta"],
      ["Physiology", "Guyton & Hall, Ganong, GK Pal"],
      ["Pathology", "Robbins & Cotran Pathologic Basis of Disease"],
      ["Medicine", "Harrison's Principles of Internal Medicine"],
      ["Surgery", "Bailey & Love's Short Practice of Surgery"],
      ["Community Med", "Park's Textbook of Preventive & Social Medicine"],
      ["Pediatrics", "Nelson Textbook of Pediatrics"],
    ];
    mbbsRefs.forEach(([subj, ref], i) => {
      const y = 2.72 + i * 0.58;
      s.addText(subj + ":", { x: 0.6, y, w: 1.5, h: 0.45, fontSize: 10, bold: true, color: C.accent, margin: 0 });
      s.addText(ref, { x: 2.1, y, w: 4.2, h: 0.45, fontSize: 9.5, color: "CBD5E1", margin: 0, wrap: true });
    });

    s.addShape("rect", { x: 6.8, y: 2.05, w: 6.1, h: 4.9, fill: { color: C.mid }, rectRadius: 0.1 });
    s.addShape("rect", { x: 6.8, y: 2.05, w: 6.1, h: 0.5, fill: { color: C.accent2 }, rectRadius: 0.1 });
    s.addText("PHARMACY CORE REFERENCES", { x: 6.95, y: 2.1, w: 5.8, h: 0.38, fontSize: 12, bold: true, color: C.white, margin: 0 });

    const pharmRefs = [
      ["General Pharmacy", "Remington: Science & Practice of Pharmacy"],
      ["Pharmacology", "Goodman & Gilman's Pharmacology"],
      ["Pharmacology", "Katzung Basic & Clinical Pharmacology"],
      ["Pharmaceutics", "Lachman's Theory & Practice (Industrial)"],
      ["Physical Pharm", "Martin's Physical Pharmacy & Pharm Sciences"],
      ["Pharmacognosy", "Trease and Evans Pharmacognosy"],
      ["Medicinal Chem", "Foye's Principles of Medicinal Chemistry"],
    ];
    pharmRefs.forEach(([subj, ref], i) => {
      const y = 2.72 + i * 0.58;
      s.addText(subj + ":", { x: 7.0, y, w: 1.6, h: 0.45, fontSize: 10, bold: true, color: C.accent2, margin: 0 });
      s.addText(ref, { x: 8.6, y, w: 4.1, h: 0.45, fontSize: 9.5, color: "CBD5E1", margin: 0, wrap: true });
    });

    s.addNotes("Stress the academic credibility of the source material — only globally mandated, peer-reviewed textbooks.");
  }

  // SLIDE 8 – IMPACT: STUDENTS, FACULTY & INSTITUTIONS
  {
    const s = pres.addSlide();
    s.background = { color: "F1F5F9" };

    s.addShape("rect", { x: 0, y: 0, w: 13.3, h: 1.05, fill: { color: C.dark } });
    s.addText("IMPACT & BENEFITS", { x: 0.5, y: 0.15, w: 8, h: 0.7, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText("WHO BENEFITS", { x: 8.5, y: 0.28, w: 4.3, h: 0.45, fontSize: 11, color: C.accent, align: "right", margin: 0, charSpacing: 2 });

    const columns = [
      {
        title: "👨🎓 Students",
        color: C.accent,
        items: [
          "Consolidates hours of library searching into seconds",
          "Multiple textbook perspectives on complex topics simultaneously",
          "Streamlined exam preparation with grouped curriculum concepts",
          "Study time focused on understanding, not finding materials",
          "Better clinical preparedness and higher pass rates",
        ],
      },
      {
        title: "🏫 Faculty",
        color: C.accent2,
        items: [
          "Instant access to authoritative diagrams and texts for lectures",
          "Massive, unified digital library available from the faculty desk",
          "Easier syllabus tracking across multiple standard texts",
          "Ensures all students study from the same high-quality baseline",
          "Reduces lecture-prep overhead significantly",
        ],
      },
      {
        title: "🏛️ Institutions",
        color: C.gold,
        items: [
          "Elevates overall standard of education provided",
          "Equal access to expensive textbooks for all enrolled students",
          "Demonstrates digital learning investment for accreditation",
          "Reduces multiple fragmented digital library subscriptions",
          "Correlates with better student outcomes & exam performance",
        ],
      },
    ];

    columns.forEach((col, ci) => {
      const x = 0.4 + ci * 4.27;
      s.addShape("rect", { x, y: 1.22, w: 3.98, h: 0.6, fill: { color: col.color }, rectRadius: 0.08 });
      s.addText(col.title, { x: x + 0.1, y: 1.26, w: 3.78, h: 0.5, fontSize: 14, bold: true, color: C.white, align: "center", margin: 0 });

      col.items.forEach((item, ii) => {
        const iy = 1.98 + ii * 1.03;
        s.addShape("rect", {
          x, y: iy, w: 3.98, h: 0.9,
          fill: { color: C.white },
          shadow: makeShadow(0.09),
          rectRadius: 0.07,
        });
        s.addShape("ellipse", { x: x + 0.14, y: iy + 0.3, w: 0.14, h: 0.14, fill: { color: col.color } });
        s.addText(item, {
          x: x + 0.35, y: iy + 0.08, w: 3.52, h: 0.74,
          fontSize: 9.5, color: C.text, margin: 0, wrap: true, valign: "middle",
        });
      });
    });

    s.addNotes("Walk through the benefits for each stakeholder group. Emphasize that all three groups win.");
  }

  // SLIDE 9 – PLATFORM vs TRADITIONAL LIBRARY
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: 11.5, y: -2, w: 5, h: 5, fill: { color: C.accent, transparency: 88 } });

    s.addText("PLACEBO vs TRADITIONAL LIBRARY", { x: 0.5, y: 0.35, w: 10, h: 0.4, fontSize: 12, color: C.accent, margin: 0, charSpacing: 4, bold: true });
    s.addText("Why Institutions Choose Placebo", { x: 0.5, y: 0.78, w: 10, h: 0.55, fontSize: 30, bold: true, color: C.white, margin: 0 });

    const headers = ["Metric", "Traditional Library", "Placebo Platform"];
    const rows = [
      ["Accessibility", "Limited by physical copies", "Infinite concurrent users"],
      ["Searchability", "Manual index scanning", "Instant digital retrieval"],
      ["Subject Coverage", "Fragmented", "34 Unified Subjects"],
      ["Total Pages", "Physically bound volumes", "346,550 Fully Indexed"],
      ["References", "Static, non-searchable", "1.2M+ Dynamic & Linked"],
      ["Cost Model", "High per-volume overhead", "Single institutional license"],
      ["Updates", "New editions require purchase", "Continuously expanded"],
    ];

    const tData = [
      headers.map((h, ci) => ({
        text: h,
        options: {
          bold: true, color: C.white,
          fill: { color: ci === 0 ? C.mid : ci === 1 ? "334155" : C.accent },
          fontSize: 11, align: "center",
        },
      })),
      ...rows.map((row, ri) =>
        row.map((cell, ci) => ({
          text: cell,
          options: {
            color: ci === 0 ? "CBD5E1" : ci === 1 ? C.muted : C.accent,
            fill: { color: ri % 2 === 0 ? C.mid : "0B2545" },
            bold: ci === 2,
            fontSize: 10.5,
            align: ci === 0 ? "left" : "center",
          },
        }))
      ),
    ];

    s.addTable(tData, {
      x: 0.5, y: 1.65, w: 12.3, h: 5.3,
      colW: [3.2, 4.2, 4.9],
      border: { pt: 0.5, color: "1E3A5F" },
      rowH: 0.62,
    });

    s.addNotes("Use this slide to directly address procurement committees. Emphasize cost consolidation and scale.");
  }

  // SLIDE 10 – GROWTH ROADMAP
  {
    const s = pres.addSlide();
    s.background = { color: "F1F5F9" };

    s.addShape("rect", { x: 0, y: 0, w: 13.3, h: 1.05, fill: { color: C.dark } });
    s.addText("CONTENT GROWTH ROADMAP", { x: 0.5, y: 0.15, w: 9, h: 0.7, fontSize: 26, bold: true, color: C.white, margin: 0 });
    s.addText("5-YEAR PLAN", { x: 9.5, y: 0.28, w: 3.3, h: 0.45, fontSize: 11, color: C.accent, align: "right", margin: 0, charSpacing: 2 });

    s.addShape("rect", { x: 0.7, y: 3.1, w: 11.9, h: 0.06, fill: { color: C.accent, transparency: 50 } });

    const milestones = [
      { year: "Year 1", title: "Core Baseline", body: "MBBS & B.Pharm curriculum fully ingested — 520 PDFs, 346K pages live.", color: C.accent, x: 0.5 },
      { year: "Year 2", title: "Allied Health", body: "Expansion into Nursing, Physiotherapy, and Allied Health Sciences curricula.", color: C.accent2, x: 3.05 },
      { year: "Year 3", title: "Postgraduate", body: "MD / MS specialty content including advanced clinical subspecialties.", color: C.gold, x: 5.6 },
      { year: "Year 4", title: "Research Layer", body: "Peer-reviewed journal integration and clinical trial database access.", color: C.green, x: 8.15 },
      { year: "Year 5", title: "Live Clinical", body: "Real-time updates, hospital formulary integration, and live clinical references.", color: "A78BFA", x: 10.7 },
    ];

    milestones.forEach((m, i) => {
      const cx = m.x + 1.2;
      s.addShape("ellipse", { x: cx - 0.22, y: 2.88, w: 0.44, h: 0.44, fill: { color: m.color } });
      s.addText(String(i + 1), { x: cx - 0.22, y: 2.88, w: 0.44, h: 0.44, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });

      s.addShape("rect", { x: m.x, y: 1.3, w: 2.4, h: 1.52, fill: { color: C.white }, shadow: makeShadow(0.12), rectRadius: 0.08 });
      s.addShape("rect", { x: m.x, y: 1.3, w: 2.4, h: 0.36, fill: { color: m.color }, rectRadius: 0.08 });
      s.addText(m.year, { x: m.x + 0.08, y: 1.33, w: 2.24, h: 0.28, fontSize: 11, bold: true, color: C.white, margin: 0 });
      s.addText(m.title, { x: m.x + 0.1, y: 1.72, w: 2.22, h: 0.3, fontSize: 10.5, bold: true, color: C.dark, margin: 0 });
      s.addText(m.body, { x: m.x + 0.1, y: 2.04, w: 2.22, h: 0.72, fontSize: 8.5, color: "475569", margin: 0, wrap: true });

      s.addText(m.year, { x: m.x, y: 3.42, w: 2.4, h: 0.35, fontSize: 10, bold: true, color: m.color, align: "center", margin: 0 });
    });

    s.addText("INSTITUTIONAL ROI HIGHLIGHTS", { x: 0.5, y: 4.05, w: 12, h: 0.38, fontSize: 11, bold: true, color: C.dark, margin: 0, charSpacing: 2 });

    const rois = [
      { icon: "📉", label: "Cost Reduction", val: "Consolidates multiple library subscriptions into one institutional license" },
      { icon: "⏱️", label: "Time Saved", val: "Returns thousands of faculty & student hours annually to active learning" },
      { icon: "📊", label: "Pass Rates", val: "Direct correlation between resource access and improved exam performance" },
      { icon: "🏆", label: "Accreditation", val: "Demonstrates digital investment to accreditation bodies and regulatory councils" },
    ];
    rois.forEach((r, i) => {
      const x = 0.4 + i * 3.12;
      s.addShape("rect", { x, y: 4.52, w: 2.88, h: 2.5, fill: { color: C.dark }, shadow: makeShadow(0.18), rectRadius: 0.08 });
      s.addText(r.icon, { x: x + 0.1, y: 4.62, w: 2.68, h: 0.55, fontSize: 26, align: "center", margin: 0 });
      s.addText(r.label, { x: x + 0.1, y: 5.2, w: 2.68, h: 0.35, fontSize: 11, bold: true, color: C.accent, align: "center", margin: 0 });
      s.addText(r.val, { x: x + 0.1, y: 5.57, w: 2.68, h: 1.32, fontSize: 9, color: C.muted, align: "center", margin: 0, wrap: true });
    });

    s.addNotes("Walk through the 5-year roadmap to show long-term value. Connect ROI to procurement decision.");
  }

  // SLIDE 11 – CONCLUSION / CTA
  {
    const s = pres.addSlide();
    s.background = { color: C.dark };

    s.addShape("ellipse", { x: 8.5, y: -2.5, w: 8, h: 8, fill: { color: C.accent, transparency: 90 } });
    s.addShape("ellipse", { x: 9.5, y: -0.5, w: 5, h: 5, fill: { color: C.accent2, transparency: 82 } });
    s.addShape("ellipse", { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.accent, transparency: 90 } });

    s.addShape("rect", { x: 0.5, y: 0.55, w: 0.06, h: 1.3, fill: { color: C.accent } });
    s.addText("PLACEBO", { x: 0.7, y: 0.55, w: 5, h: 0.55, fontSize: 28, bold: true, color: C.white, margin: 0, charSpacing: 6 });
    s.addText("EDUCATION SOLUTIONS", { x: 0.7, y: 1.05, w: 5, h: 0.35, fontSize: 11, color: C.accent, margin: 0, charSpacing: 4 });

    s.addText("A single, comprehensive academic repository covering the complete\nspectrum of MBBS and Pharmacy education — structured,\ncurriculum-aligned, and built for institutional scale.", {
      x: 0.5, y: 1.85, w: 9.2, h: 2.1,
      fontSize: 20, color: C.white, italic: true, margin: 0, align: "left",
    });

    s.addShape("rect", { x: 0.5, y: 4.05, w: 4.5, h: 0.04, fill: { color: C.accent, transparency: 40 } });

    s.addText("Bridge the gap between heavy traditional textbooks and\nthe modern demand for instant, verified medical knowledge.", {
      x: 0.5, y: 4.3, w: 8.5, h: 0.7,
      fontSize: 14, color: C.muted, margin: 0,
    });

    s.addShape("rect", { x: 0.5, y: 5.15, w: 6.5, h: 1.85, fill: { color: C.accent }, rectRadius: 0.1, shadow: makeShadow(0.3) });
    s.addText("Ready to Partner?", { x: 0.7, y: 5.3, w: 6.1, h: 0.5, fontSize: 18, bold: true, color: C.white, margin: 0 });
    s.addText("Contact Placebo Education Solutions to schedule an institutional demo\nand explore partnership models tailored to your institution.", {
      x: 0.7, y: 5.82, w: 6.1, h: 1.0,
      fontSize: 11, color: "E0F2F1", margin: 0,
    });

    const finalStats = [
      { val: "34", lbl: "Subjects" },
      { val: "520", lbl: "PDFs" },
      { val: "49.3 GB", lbl: "Content" },
      { val: "1.2M+", lbl: "References" },
    ];
    finalStats.forEach((st, i) => {
      const x = 7.4 + (i % 2) * 2.8;
      const y = 4.0 + Math.floor(i / 2) * 1.5;
      s.addShape("rect", { x, y, w: 2.55, h: 1.3, fill: { color: C.mid }, rectRadius: 0.08 });
      s.addText(st.val, { x: x + 0.1, y: y + 0.08, w: 2.35, h: 0.65, fontSize: 26, bold: true, color: C.accent, align: "center", margin: 0 });
      s.addText(st.lbl, { x: x + 0.1, y: y + 0.72, w: 2.35, h: 0.42, fontSize: 10, color: C.muted, align: "center", margin: 0 });
    });

    s.addNotes("Close with the vision and a clear call to action. Ask for next steps — demo or proposal.");
  }

  await pres.writeFile({ fileName: "d:/sample chatbot/Placebo_Pitch_Deck.pptx" });
  console.log("Deck written successfully to d:/sample chatbot/Placebo_Pitch_Deck.pptx");
}

buildDeck().catch(console.error);
