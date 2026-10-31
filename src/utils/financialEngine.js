/**
 * CAMPUS POINT - CENTRAL FINANCIAL & OPERATIONAL SIMULATION ENGINE
 * Exclusively Student Mentorship Business Model (Students Pay -> Campus Point Pays Mentors -> Retained Profit)
 * Formula-driven single source of truth. Zero hardcoded dashboard values.
 */

export const DEFAULT_STARTING_CASH = 500000; // ₹5,00,000 initial founder/seed capital
export const DEFAULT_USD_INR_RATE = 85.0; // 1 USD = 85 INR
export const DEFAULT_TAX_RATE = 0.15; // 15% corporate tax provision on positive net operating profit
export const DEFAULT_GATEWAY_FEE_PCT = 0.022; // 2.2% payment gateway fee (Razorpay/Stripe)

// 1. Initial Mentorship Packages (as specified by user prompt)
export const DEFAULT_PACKAGES = [
  {
    id: "pkg_1m",
    name: "1-Month Mentorship",
    durationMonths: 1,
    priceInr: 999,
    priceUsd: 29,
    discountPct: 0,
    sharePct: 35, // 35% of students pick 1-month
    description: "Introductory 1-on-1 strategy, study roadmap & weekly check-in",
  },
  {
    id: "pkg_3m",
    name: "3-Month Mentorship",
    durationMonths: 3,
    priceInr: 2499,
    priceUsd: 69,
    discountPct: 5,
    sharePct: 40, // 40% pick 3-month (core offering)
    description: "Subject backlog clearance, mock test analytics & daily guidance",
  },
  {
    id: "pkg_6m",
    name: "6-Month Mentorship",
    durationMonths: 6,
    priceInr: 4499,
    priceUsd: 119,
    discountPct: 10,
    sharePct: 15, // 15% pick 6-month
    description: "Deep chapter audits, test speed drill pacing & IIT Roorkee mentor pairing",
  },
  {
    id: "pkg_12m",
    name: "12-Month Mentorship",
    durationMonths: 12,
    priceInr: 7999,
    priceUsd: 199,
    discountPct: 15,
    sharePct: 10, // 10% pick full year
    description: "Full-cycle academic year personal mentor, unlimited CBT analytics & rank surge",
  },
];

// 2. Initial Mentors Caseload & Roster
export const DEFAULT_MENTORS = [
  {
    id: "m_1",
    name: "Ankit Kumar",
    department: "Academic & JEE Mentorship",
    role: "Lead Physics & JEE Advanced Mentor",
    college: "IIT Roorkee",
    paymentModel: "hybrid", // "revenue_share" | "fixed" | "per_student" | "per_session" | "hybrid"
    commissionPct: 35, // 35% revenue share
    fixedCompensation: 15000, // ₹15,000 fixed retainer
    ratePerStudent: 600,
    ratePerSession: 350,
    monthlyCapacity: 45,
    rating: 4.9,
    active: true,
  },
  {
    id: "m_2",
    name: "Saket Verma",
    department: "Academic & JEE Mentorship",
    role: "Mathematics & Speed Drill Mentor",
    college: "IIT Roorkee",
    paymentModel: "revenue_share",
    commissionPct: 40, // 40% commission
    fixedCompensation: 0,
    ratePerStudent: 650,
    ratePerSession: 350,
    monthlyCapacity: 40,
    rating: 4.85,
    active: true,
  },
  {
    id: "m_3",
    name: "Dr. Saneh Sharma",
    department: "NEET Medical Mentorship",
    role: "Head of NEET Biology & Chemistry",
    college: "AIIMS / IIT Delhi",
    paymentModel: "hybrid",
    commissionPct: 30,
    fixedCompensation: 18000,
    ratePerStudent: 700,
    ratePerSession: 400,
    monthlyCapacity: 50,
    rating: 4.95,
    active: true,
  },
  {
    id: "m_4",
    name: "Mayank Joshi",
    department: "Academic & JEE Mentorship",
    role: "Inorganic & Organic Chemistry Specialist",
    college: "IIT Roorkee",
    paymentModel: "per_student",
    commissionPct: 35,
    fixedCompensation: 0,
    ratePerStudent: 600,
    ratePerSession: 300,
    monthlyCapacity: 35,
    rating: 4.78,
    active: true,
  },
  {
    id: "m_5",
    name: "Pooja Singhal",
    department: "Academic & International Mentorship",
    role: "NRI & International Student Coordinator",
    college: "IIT Roorkee",
    paymentModel: "revenue_share",
    commissionPct: 40,
    fixedCompensation: 10000,
    ratePerStudent: 900,
    ratePerSession: 500,
    monthlyCapacity: 30,
    rating: 4.92,
    active: true,
  },
];

// 3. Initial Team & Equity Structure (Distinguishing Equity, Salary, and Profit Sharing)
export const DEFAULT_TEAM = [
  {
    id: "tm_founder",
    name: "Ankit Yadav",
    position: "Founder & Chief Executive Officer",
    department: "Executive Management",
    ownershipPct: 60.0, // 60% Equity
    monthlySalary: 45000, // Monthly operational compensation
    profitSharingPct: 55.0, // 55% share of distributable team pool
    bonusIncentive: 5000,
    responsibilities: "Strategy, business decisions, investor relations & financial oversight",
    joiningDate: "2025-01-01",
    status: "active",
    avatarInitials: "AY",
    reportsTo: null,
  },
  {
    id: "tm_academic_lead",
    name: "Ankit Kumar",
    position: "Co-Founder & Head of Academic Mentorship",
    department: "Academic & Mentorship",
    ownershipPct: 20.0, // 20% Equity
    monthlySalary: 35000,
    profitSharingPct: 25.0,
    bonusIncentive: 4000,
    responsibilities: "Mentor recruitment, quality audits, CBT curriculum & JEE pedagogy",
    joiningDate: "2025-01-15",
    status: "active",
    avatarInitials: "AK",
    reportsTo: "tm_founder",
  },
  {
    id: "tm_tech_lead",
    name: "Cody Fisher",
    position: "Lead Full-Stack Engineer",
    department: "Technology & Product",
    ownershipPct: 10.0, // 10% Equity
    monthlySalary: 32000,
    profitSharingPct: 10.0,
    bonusIncentive: 2500,
    responsibilities: "Campus Point portal, mentor console, video room & real-time telemetry",
    joiningDate: "2025-02-01",
    status: "active",
    avatarInitials: "CF",
    reportsTo: "tm_founder",
  },
  {
    id: "tm_marketing_lead",
    name: "Leslie Alexander",
    position: "Head of Growth & Performance Marketing",
    department: "Business & Marketing",
    ownershipPct: 6.0, // 6% Equity
    monthlySalary: 28000,
    profitSharingPct: 6.0,
    bonusIncentive: 3000,
    responsibilities: "Instagram, YouTube SEO, IIT student campus influencer campaigns & CAC control",
    joiningDate: "2025-02-15",
    status: "active",
    avatarInitials: "LA",
    reportsTo: "tm_founder",
  },
  {
    id: "tm_ops_lead",
    name: "Brooklyn Simmons",
    position: "Student Success & Operations Lead",
    department: "Student Operations",
    ownershipPct: 4.0, // 4% Equity (Total equity = 60 + 20 + 10 + 6 + 4 = 100%)
    monthlySalary: 25000,
    profitSharingPct: 4.0,
    bonusIncentive: 2000,
    responsibilities: "Diagnostic counselling calls, student-mentor onboarding & 24/7 support",
    joiningDate: "2025-03-01",
    status: "active",
    avatarInitials: "BS",
    reportsTo: "tm_founder",
  },
];

// 4. Profit Distribution Policy (must equal 100%)
export const DEFAULT_PROFIT_POLICY = {
  retainedBusinessPct: 40.0, // 40% retained for growth & reinvestment
  founderDistributionPct: 30.0, // 30% founder dividend
  teamProfitSharingPct: 20.0, // 20% team performance bonus pool
  emergencyReservePct: 10.0, // 10% emergency buffer
};

// 5. Default Recurring Non-Mentor Expenses
export const DEFAULT_EXPENSES = [
  // B. Technology Expenses
  { id: "exp_tech_1", category: "Technology", name: "Cloud Servers & Hosting (Vercel + AWS EC2)", monthlyCost: 4500, recurring: true, department: "Technology & Product" },
  { id: "exp_tech_2", category: "Technology", name: "PostgreSQL Database & Auth (Supabase)", monthlyCost: 2500, recurring: true, department: "Technology & Product" },
  { id: "exp_tech_3", category: "Technology", name: "Video Meeting Infrastructure (Daily.co / Google Meet WebRTC)", monthlyCost: 3200, recurring: true, department: "Technology & Product" },
  { id: "exp_tech_4", category: "Technology", name: "Transactional Email & SMS (Resend / AWS SES)", monthlyCost: 1200, recurring: true, department: "Technology & Product" },
  { id: "exp_tech_5", category: "Technology", name: "Domain, Cloudflare SSL & Security CDN", monthlyCost: 1500, recurring: true, department: "Technology & Product" },
  { id: "exp_tech_6", category: "Technology", name: "Sentry Monitoring, Error Logs & API Tokens", monthlyCost: 1100, recurring: true, department: "Technology & Product" },

  // C. Marketing Expenses
  { id: "exp_mkt_1", category: "Marketing", name: "Instagram Reels & YouTube Content Production", monthlyCost: 18000, recurring: true, department: "Business & Marketing" },
  { id: "exp_mkt_2", category: "Marketing", name: "Paid Acquisition (Meta & Google JEE/NEET Ads)", monthlyCost: 28000, recurring: true, department: "Business & Marketing" },
  { id: "exp_mkt_3", category: "Marketing", name: "IIT Roorkee / Top College Student Influencers", monthlyCost: 12000, recurring: true, department: "Business & Marketing" },
  { id: "exp_mkt_4", category: "Marketing", name: "Creative Design Assets & Video Thumbnails", monthlyCost: 5000, recurring: true, department: "Business & Marketing" },

  // D. Operations Expenses
  { id: "exp_ops_1", category: "Operations", name: "Student Academic Counselling Support", monthlyCost: 14000, recurring: true, department: "Student Operations" },
  { id: "exp_ops_2", category: "Operations", name: "SaaS Subscriptions (Google Workspace, Slack, Notion)", monthlyCost: 4500, recurring: true, department: "Student Operations" },
  { id: "exp_ops_3", category: "Operations", name: "Accounting, Compliance & Legal Administration", monthlyCost: 4000, recurring: true, department: "Executive Management" },
  { id: "exp_ops_4", category: "Operations", name: "Office / Team Miscellaneous & Contingency", monthlyCost: 3500, recurring: true, department: "Student Operations" },
];

// 6. Default Monthly Student Acquisition Targets (Total: 1,000 Indian + 50 International = 1,050)
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Monthly seasonality weights aligned with the Indian entrance exam calendar (Peak April-July, ramp in Jan-Mar)
export const DEFAULT_MONTHLY_STUDENT_TARGETS = [
  { month: "January",   indianPaying: 45,  intlPaying: 2, renewalRatePct: 15, refundRatePct: 2 },
  { month: "February",  indianPaying: 55,  intlPaying: 2, renewalRatePct: 18, refundRatePct: 2 },
  { month: "March",     indianPaying: 70,  intlPaying: 3, renewalRatePct: 20, refundRatePct: 2 },
  { month: "April",     indianPaying: 110, intlPaying: 5, renewalRatePct: 22, refundRatePct: 2 }, // JEE Main session 2
  { month: "May",       indianPaying: 140, intlPaying: 7, renewalRatePct: 25, refundRatePct: 2 }, // NEET & JEE Adv peak
  { month: "June",      indianPaying: 160, intlPaying: 8, renewalRatePct: 28, refundRatePct: 2 }, // JoSAA Counselling peak
  { month: "July",      indianPaying: 130, intlPaying: 7, renewalRatePct: 28, refundRatePct: 2 }, // New batch start
  { month: "August",    indianPaying: 90,  intlPaying: 5, renewalRatePct: 25, refundRatePct: 2 },
  { month: "September", indianPaying: 75,  intlPaying: 4, renewalRatePct: 24, refundRatePct: 2 },
  { month: "October",   indianPaying: 50,  intlPaying: 3, renewalRatePct: 22, refundRatePct: 2 },
  { month: "November",  indianPaying: 40,  intlPaying: 2, renewalRatePct: 20, refundRatePct: 2 },
  { month: "December",  indianPaying: 35,  intlPaying: 2, renewalRatePct: 18, refundRatePct: 2 },
];
// Sum of indianPaying = 45+55+70+110+140+160+130+90+75+50+40+35 = 1,000 Indian students
// Sum of intlPaying = 2+2+3+5+7+8+7+5+4+3+2+2 = 50 International students
// Total = 1,050 paying students.

// 7. Funnel Conversion Assumptions
export const DEFAULT_FUNNEL = {
  indian: {
    socialMediaViewsPerMonth: 120000,
    visitorConversionPct: 8.0, // 8% click to website
    leadConversionPct: 5.0, // 5% submit interest / lead
    counsellingCompletionPct: 60.0, // 60% of leads complete 1-on-1 diagnostic call
    paidConversionPct: 35.0, // 35% of counselled leads purchase mentorship
  },
  intl: {
    marketingReachPerMonth: 25000,
    visitorConversionPct: 6.0,
    leadConversionPct: 4.0,
    counsellingCompletionPct: 50.0,
    paidConversionPct: 25.0,
  },
};

// 8. Scenario Multipliers (What-If baseline)
export const DEFAULT_WHAT_IF = {
  priceAdjustmentPct: 0, // e.g. +15% or -10%
  mentorCommissionOverridePct: null, // null = use mentor roster rates, or set e.g. 45%
  indianVolumeMultiplier: 1.0, // 1.0 = 1,000 students
  intlVolumeMultiplier: 1.0, // 1.0 = 50 students
  serverCostMultiplier: 1.0, // e.g. 2.0 = double
  marketingCostMultiplier: 1.0, // e.g. 1.3 = +30%
  renewalRateBoostPct: 0, // e.g. +10%
  refundRateOverridePct: null,
};

/**
 * Calculate Blended Average Revenue Per User (ARPU) across active packages
 */
export function calculateBlendedARPU(packages, usdToInr = DEFAULT_USD_INR_RATE, priceAdjustmentPct = 0) {
  const mult = 1 + priceAdjustmentPct / 100;
  let totalShare = 0;
  let weightedInr = 0;
  let weightedUsd = 0;

  packages.forEach((pkg) => {
    const share = Number(pkg.sharePct) || 0;
    totalShare += share;
    const discountedInr = (Number(pkg.priceInr) || 0) * (1 - (Number(pkg.discountPct) || 0) / 100) * mult;
    const discountedUsd = (Number(pkg.priceUsd) || 0) * (1 - (Number(pkg.discountPct) || 0) / 100) * mult;
    weightedInr += discountedInr * share;
    weightedUsd += discountedUsd * share;
  });

  const divisor = totalShare > 0 ? totalShare : 100;
  const inrArpu = weightedInr / divisor;
  const usdArpu = weightedUsd / divisor;
  const intlInrArpu = usdArpu * usdToInr;

  return {
    inrArpu: Math.round(inrArpu),
    usdArpu: Math.round(usdArpu * 10) / 10,
    intlInrArpu: Math.round(intlInrArpu),
    totalShare,
  };
}

/**
 * Core Formula Engine: Calculate full 12-month simulation
 */
export function runFinancialSimulation({
  packages = DEFAULT_PACKAGES,
  mentors = DEFAULT_MENTORS,
  team = DEFAULT_TEAM,
  profitPolicy = DEFAULT_PROFIT_POLICY,
  expenses = DEFAULT_EXPENSES,
  monthlyTargets = DEFAULT_MONTHLY_STUDENT_TARGETS,
  startingCash = DEFAULT_STARTING_CASH,
  usdToInr = DEFAULT_USD_INR_RATE,
  taxRate = DEFAULT_TAX_RATE,
  gatewayFeePct = DEFAULT_GATEWAY_FEE_PCT,
  whatIf = DEFAULT_WHAT_IF,
}) {
  const arpu = calculateBlendedARPU(packages, usdToInr, whatIf.priceAdjustmentPct || 0);

  // Compute fixed team monthly payroll
  const monthlyTeamSalaries = team.reduce((acc, m) => (m.status === "active" ? acc + Number(m.monthlySalary || 0) : acc), 0);

  // Compute fixed recurring non-mentor expenses
  const techExpenses = expenses
    .filter((e) => e.category === "Technology" && e.recurring)
    .reduce((acc, e) => acc + Number(e.monthlyCost || 0), 0) * (whatIf.serverCostMultiplier || 1.0);

  const marketingExpenses = expenses
    .filter((e) => e.category === "Marketing" && e.recurring)
    .reduce((acc, e) => acc + Number(e.monthlyCost || 0), 0) * (whatIf.marketingCostMultiplier || 1.0);

  const operationsExpenses = expenses
    .filter((e) => e.category === "Operations" && e.recurring)
    .reduce((acc, e) => acc + Number(e.monthlyCost || 0), 0);

  // Total mentor roster capacity
  const totalMentorCapacity = mentors.reduce((acc, m) => (m.active ? acc + Number(m.monthlyCapacity || 0) : acc), 0);

  // Monthly Simulation Array
  let runningCash = Number(startingCash) || 0;
  let cumulativeRevenue = 0;
  let cumulativeMentorCost = 0;
  let cumulativeGrossProfit = 0;
  let cumulativeOperatingProfit = 0;
  let cumulativeNetProfit = 0;
  let cumulativeRetained = 0;
  let cumulativeDistributable = 0;
  let previousActiveStudents = 0;

  const monthlyResults = monthlyTargets.map((target, idx) => {
    // 1. Student volumes with What-If multipliers
    const rawIndian = Math.round((Number(target.indianPaying) || 0) * (whatIf.indianVolumeMultiplier || 1.0));
    const rawIntl = Math.round((Number(target.intlPaying) || 0) * (whatIf.intlVolumeMultiplier || 1.0));
    const renewalRate = Math.min(100, Math.max(0, (Number(target.renewalRatePct) || 0) + (whatIf.renewalRateBoostPct || 0)));
    const refundRate = whatIf.refundRateOverridePct !== null ? whatIf.refundRateOverridePct : (Number(target.refundRatePct) || 2);

    // Renewals and Refunds
    const renewedStudents = Math.round((previousActiveStudents * renewalRate) / 100);
    const totalAcquiredStudents = rawIndian + rawIntl;
    const refundsCount = Math.round(((totalAcquiredStudents + renewedStudents) * refundRate) / 100);
    const netPayingStudents = Math.max(0, totalAcquiredStudents + renewedStudents - refundsCount);

    // Active students currently under mentorship this month
    const activeStudents = netPayingStudents;
    previousActiveStudents = activeStudents;

    // 2. Mentorship Revenue
    const indianGrossRev = (rawIndian + Math.round((renewedStudents * rawIndian) / (totalAcquiredStudents || 1))) * arpu.inrArpu;
    const intlGrossRev = (rawIntl + Math.round((renewedStudents * rawIntl) / (totalAcquiredStudents || 1))) * arpu.intlInrArpu;
    const grossRevenue = indianGrossRev + intlGrossRev;
    const refundDeduction = (grossRevenue * refundRate) / 100;
    const totalRevenue = Math.max(0, Math.round(grossRevenue - refundDeduction));

    // 3. Direct Cost of Mentorship Delivery (Mentor payouts)
    // Dynamic mentor distribution based on active roster or override commission
    let monthlyMentorCost = 0;
    if (whatIf.mentorCommissionOverridePct !== null) {
      // Direct scenario override
      monthlyMentorCost = Math.round((totalRevenue * whatIf.mentorCommissionOverridePct) / 100);
    } else {
      // Calculate from individual mentor model roster
      const studentsPerMentor = mentors.length > 0 ? activeStudents / mentors.length : 0;
      mentors.forEach((m) => {
        if (!m.active) return;
        let payout = 0;
        const assigned = Math.min(Number(m.monthlyCapacity || 40), Math.round(studentsPerMentor));
        const mentorRevShare = assigned * arpu.inrArpu;

        if (m.paymentModel === "revenue_share") {
          payout = (mentorRevShare * Number(m.commissionPct || 40)) / 100;
        } else if (m.paymentModel === "fixed") {
          payout = Number(m.fixedCompensation || 20000);
        } else if (m.paymentModel === "per_student") {
          payout = assigned * Number(m.ratePerStudent || 600);
        } else if (m.paymentModel === "per_session") {
          const estimatedSessions = assigned * 4; // 4 sessions per student per month
          payout = estimatedSessions * Number(m.ratePerSession || 350);
        } else if (m.paymentModel === "hybrid") {
          payout = Number(m.fixedCompensation || 12000) + (mentorRevShare * Number(m.commissionPct || 25)) / 100;
        }
        monthlyMentorCost += payout;
      });
    }

    // 4. Payment Gateway & Direct Delivery Fees
    const gatewayFees = Math.round(totalRevenue * gatewayFeePct);

    // 5. Gross Profit (Revenue minus Direct Delivery Costs)
    const grossProfit = totalRevenue - monthlyMentorCost - gatewayFees;
    const grossMarginPct = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 1000) / 10 : 0;

    // 6. Operating Expenses (OpEx)
    const currentTech = Math.round(techExpenses + (activeStudents > 200 ? (activeStudents - 200) * 12 : 0));
    const currentMarketing = Math.round(marketingExpenses);
    const currentOperations = Math.round(operationsExpenses);
    const currentSalaries = Math.round(monthlyTeamSalaries);
    const totalOpEx = currentTech + currentMarketing + currentOperations + currentSalaries;

    // 7. Operating Profit (EBITDA)
    const operatingProfit = grossProfit - totalOpEx;

    // 8. Tax Provision (Only applied on positive operating income)
    const taxProvision = operatingProfit > 0 ? Math.round(operatingProfit * taxRate) : 0;

    // 9. Net Profit (Accounting Net Income)
    const netProfit = operatingProfit - taxProvision;
    const netMarginPct = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 1000) / 10 : 0;

    // 10. Distributable Profit & Retained Earnings (With Negative Profit Safeguard)
    let distributableProfit = 0;
    let retainedEarnings = 0;
    let emergencyReserveAddition = 0;
    let founderDividend = 0;
    let teamProfitPool = 0;

    if (netProfit > 0) {
      retainedEarnings = Math.round((netProfit * (profitPolicy.retainedBusinessPct || 40)) / 100);
      emergencyReserveAddition = Math.round((netProfit * (profitPolicy.emergencyReservePct || 10)) / 100);
      founderDividend = Math.round((netProfit * (profitPolicy.founderDistributionPct || 30)) / 100);
      teamProfitPool = Math.round((netProfit * (profitPolicy.teamProfitSharingPct || 20)) / 100);
      distributableProfit = founderDividend + teamProfitPool;
    } else {
      // In negative months, entire deficit is absorbed by retained/cash balance. Zero distributions.
      retainedEarnings = netProfit;
      distributableProfit = 0;
    }

    // 11. Cash Flow & Cash on Hand (Accounting Profit vs Cash Inflow/Outflow)
    const openingCash = Math.round(runningCash);
    const cashInflows = totalRevenue;
    const cashOutflows = monthlyMentorCost + gatewayFees + totalOpEx + taxProvision + distributableProfit;
    const netCashFlow = cashInflows - cashOutflows;
    runningCash += netCashFlow;
    const closingCash = Math.round(runningCash);

    // Mentor utilization & capacity
    const mentorUtilizationPct = totalMentorCapacity > 0 ? Math.round((activeStudents / totalMentorCapacity) * 100) : 100;
    const remainingMentorCapacity = Math.max(0, totalMentorCapacity - activeStudents);

    // Cumulative tallies
    cumulativeRevenue += totalRevenue;
    cumulativeMentorCost += monthlyMentorCost;
    cumulativeGrossProfit += grossProfit;
    cumulativeOperatingProfit += operatingProfit;
    cumulativeNetProfit += netProfit;
    cumulativeRetained += retainedEarnings;
    cumulativeDistributable += distributableProfit;

    return {
      month: target.month,
      monthIndex: idx,
      indianPaying: rawIndian,
      intlPaying: rawIntl,
      renewedStudents,
      refundsCount,
      activeStudents,
      totalRevenue,
      indianGrossRev,
      intlGrossRev,
      monthlyMentorCost,
      gatewayFees,
      grossProfit,
      grossMarginPct,
      techExpenses: currentTech,
      marketingExpenses: currentMarketing,
      operationsExpenses: currentOperations,
      teamSalaries: currentSalaries,
      totalOpEx,
      operatingProfit,
      taxProvision,
      netProfit,
      netMarginPct,
      retainedEarnings,
      distributableProfit,
      founderDividend,
      teamProfitPool,
      openingCash,
      cashInflows,
      cashOutflows,
      netCashFlow,
      closingCash,
      mentorUtilizationPct,
      remainingMentorCapacity,
      cumulativeRevenue,
      cumulativeNetProfit,
      cumulativeRetained,
    };
  });

  // Year 1 Annual Summary Aggregates
  const totalPayingIndian = monthlyResults.reduce((acc, m) => acc + m.indianPaying, 0);
  const totalPayingIntl = monthlyResults.reduce((acc, m) => acc + m.intlPaying, 0);
  const totalPayingStudents = totalPayingIndian + totalPayingIntl;
  const totalRenewals = monthlyResults.reduce((acc, m) => acc + m.renewedStudents, 0);
  const totalRefunds = monthlyResults.reduce((acc, m) => acc + m.refundsCount, 0);

  const annualRevenue = cumulativeRevenue;
  const annualMentorCost = cumulativeMentorCost;
  const annualGrossProfit = cumulativeGrossProfit;
  const annualGrossMarginPct = annualRevenue > 0 ? Math.round((annualGrossProfit / annualRevenue) * 1000) / 10 : 0;
  const annualOpEx = monthlyResults.reduce((acc, m) => acc + m.totalOpEx, 0);
  const annualOperatingProfit = cumulativeOperatingProfit;
  const annualTaxes = monthlyResults.reduce((acc, m) => acc + m.taxProvision, 0);
  const annualNetProfit = cumulativeNetProfit;
  const annualNetMarginPct = annualRevenue > 0 ? Math.round((annualNetProfit / annualRevenue) * 1000) / 10 : 0;
  const annualRetainedEarnings = cumulativeRetained;
  const annualDistributableProfit = cumulativeDistributable;
  const endingCashOnHand = runningCash;

  // What Campus Point keeps vs What Mentors Get
  const mentorSharePct = annualRevenue > 0 ? Math.round((annualMentorCost / annualRevenue) * 1000) / 10 : 0;
  const campusPointRetainedSharePct = Math.round((100 - mentorSharePct) * 10) / 10;
  const averageCostPerStudent = totalPayingStudents > 0 ? Math.round(annualMentorCost / totalPayingStudents) : 0;

  // Unit Economics & Break-Even Analysis
  const blendedArpu = totalPayingStudents > 0 ? Math.round(annualRevenue / totalPayingStudents) : arpu.inrArpu;
  const variableCostPerStudent = totalPayingStudents > 0 ? Math.round((annualMentorCost + monthlyResults.reduce((acc, m) => acc + m.gatewayFees, 0)) / totalPayingStudents) : Math.round(blendedArpu * 0.42);
  const contributionMarginPerStudent = Math.max(1, blendedArpu - variableCostPerStudent);
  const contributionMarginPct = Math.round((contributionMarginPerStudent / blendedArpu) * 1000) / 10;

  const annualFixedCosts = annualOpEx;
  const monthlyAverageFixedCosts = Math.round(annualFixedCosts / 12);

  // Break-even students required
  const annualBreakEvenStudents = Math.ceil(annualFixedCosts / contributionMarginPerStudent);
  const monthlyBreakEvenStudents = Math.ceil(monthlyAverageFixedCosts / contributionMarginPerStudent);
  const annualBreakEvenRevenue = annualBreakEvenStudents * blendedArpu;

  // Customer Acquisition Cost (CAC) vs Customer Lifetime Value (LTV)
  const annualMarketingSpend = monthlyResults.reduce((acc, m) => acc + m.marketingExpenses, 0);
  const blendedCAC = totalPayingStudents > 0 ? Math.round(annualMarketingSpend / totalPayingStudents) : 0;
  const avgRetentionMultiplier = 1 + (monthlyTargets.reduce((acc, m) => acc + (m.renewalRatePct || 20), 0) / 1200);
  const customerLTV = Math.round(blendedArpu * avgRetentionMultiplier);
  const ltvToCacRatio = blendedCAC > 0 ? Math.round((customerLTV / blendedCAC) * 10) / 10 : 0;

  // Month when the business becomes profitable
  const firstProfitableMonth = monthlyResults.find((m) => m.netProfit > 0)?.month || "Month 1";
  const firstCashFlowPositiveMonth = monthlyResults.find((m) => m.netCashFlow > 0)?.month || "Month 1";

  // Minimum cash balance and runway
  const minCashBalance = Math.min(...monthlyResults.map((m) => m.closingCash));
  const negativeCashMonths = monthlyResults.filter((m) => m.netCashFlow < 0);
  const avgMonthlyBurn = negativeCashMonths.length > 0
    ? Math.round(Math.abs(negativeCashMonths.reduce((acc, m) => acc + m.netCashFlow, 0) / negativeCashMonths.length))
    : 0;
  const runwayMonths = avgMonthlyBurn > 0 ? Math.round((endingCashOnHand / avgMonthlyBurn) * 10) / 10 : "Infinite (Profitable)";

  return {
    arpu,
    monthlyResults,
    aggregates: {
      totalPayingIndian,
      totalPayingIntl,
      totalPayingStudents,
      totalRenewals,
      totalRefunds,
      annualRevenue,
      annualMentorCost,
      annualGrossProfit,
      annualGrossMarginPct,
      annualOpEx,
      annualOperatingProfit,
      annualTaxes,
      annualNetProfit,
      annualNetMarginPct,
      annualRetainedEarnings,
      annualDistributableProfit,
      endingCashOnHand,
      startingCash,
      mentorSharePct,
      campusPointRetainedSharePct,
      averageCostPerStudent,
      blendedArpu,
      contributionMarginPerStudent,
      contributionMarginPct,
      annualFixedCosts,
      monthlyAverageFixedCosts,
      annualBreakEvenStudents,
      monthlyBreakEvenStudents,
      annualBreakEvenRevenue,
      annualMarketingSpend,
      blendedCAC,
      customerLTV,
      ltvToCacRatio,
      firstProfitableMonth,
      firstCashFlowPositiveMonth,
      minCashBalance,
      avgMonthlyBurn,
      runwayMonths,
      totalMentorCapacity,
    },
  };
}

/**
 * Currency Formatter Utility
 */
export function formatCurrency(amount, currency = "INR", compact = false) {
  const num = Number(amount) || 0;
  if (currency === "USD") {
    if (compact) {
      if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(1)}k`;
      return `$${Math.round(num)}`;
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(num);
  }

  // INR Formatting (Lakhs & Crores)
  if (compact) {
    if (Math.abs(num) >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
    if (Math.abs(num) >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
    if (Math.abs(num) >= 1e3) return `₹${(num / 1e3).toFixed(1)}k`;
    return `₹${Math.round(num)}`;
  }
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num);
}

/**
 * Generate CSV text of complete 12-month P&L and Cash Flow
 */
export function generateSimulationCSV(simulation) {
  const rows = [
    [
      "Month",
      "Indian Students",
      "Intl Students",
      "Renewed",
      "Active Students",
      "Total Revenue (INR)",
      "Mentor Payouts (INR)",
      "Gross Profit (INR)",
      "Gross Margin %",
      "Tech Expenses (INR)",
      "Marketing Expenses (INR)",
      "Ops & Gateway (INR)",
      "Team Salaries (INR)",
      "Total OpEx (INR)",
      "Operating Profit (INR)",
      "Tax Provision (INR)",
      "Net Profit (INR)",
      "Net Margin %",
      "Retained Earnings (INR)",
      "Distributable Profit (INR)",
      "Opening Cash (INR)",
      "Closing Cash (INR)"
    ]
  ];

  simulation.monthlyResults.forEach((m) => {
    rows.push([
      m.month,
      m.indianPaying,
      m.intlPaying,
      m.renewedStudents,
      m.activeStudents,
      m.totalRevenue,
      m.monthlyMentorCost,
      m.grossProfit,
      `${m.grossMarginPct}%`,
      m.techExpenses,
      m.marketingExpenses,
      m.operationsExpenses + m.gatewayFees,
      m.teamSalaries,
      m.totalOpEx,
      m.operatingProfit,
      m.taxProvision,
      m.netProfit,
      `${m.netMarginPct}%`,
      m.retainedEarnings,
      m.distributableProfit,
      m.openingCash,
      m.closingCash
    ]);
  });

  return rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
}

