import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPlans() {
  const plans: Array<{
    name: string;
    displayName: string;
    priceMonthlyUsd: string | null;
    maxItemsPerScan: number | null;
    textDetection: boolean;
    imageDetection: boolean;
    fixDashboard: boolean;
    auditLog: boolean;
    auditLogPdfExport: boolean;
    monthlyAutoScan: boolean;
    rewriteEngine: boolean;
    maxShops: number | null;
    whiteLabelReports: boolean;
    apiAccess: boolean;
    apiMonthlyCalls: number | null;
    teamMembers: number;
    slaSupport: string;
  }> = [
    {
      name: "free",
      displayName: "Free",
      priceMonthlyUsd: "0",
      maxItemsPerScan: 50,
      textDetection: true,
      imageDetection: false,
      fixDashboard: false,
      auditLog: false,
      auditLogPdfExport: false,
      monthlyAutoScan: false,
      rewriteEngine: false,
      maxShops: 1,
      whiteLabelReports: false,
      apiAccess: false,
      apiMonthlyCalls: null,
      teamMembers: 1,
      slaSupport: "community",
    },
    {
      name: "basic",
      displayName: "Basic",
      priceMonthlyUsd: "29",
      maxItemsPerScan: 500,
      textDetection: true,
      imageDetection: true,
      fixDashboard: true,
      auditLog: true,
      auditLogPdfExport: true,
      monthlyAutoScan: true,
      rewriteEngine: false,
      maxShops: 1,
      whiteLabelReports: false,
      apiAccess: false,
      apiMonthlyCalls: null,
      teamMembers: 1,
      slaSupport: "email",
    },
    {
      name: "pro",
      displayName: "Pro",
      priceMonthlyUsd: "99",
      maxItemsPerScan: 1500,
      textDetection: true,
      imageDetection: true,
      fixDashboard: true,
      auditLog: true,
      auditLogPdfExport: true,
      monthlyAutoScan: true,
      rewriteEngine: true,
      maxShops: 3,
      whiteLabelReports: false,
      apiAccess: true,
      apiMonthlyCalls: null,
      teamMembers: 3,
      slaSupport: "email",
    },
    {
      name: "agency",
      displayName: "Agency",
      priceMonthlyUsd: "199",
      maxItemsPerScan: null,
      textDetection: true,
      imageDetection: true,
      fixDashboard: true,
      auditLog: true,
      auditLogPdfExport: true,
      monthlyAutoScan: true,
      rewriteEngine: true,
      maxShops: null,
      whiteLabelReports: true,
      apiAccess: true,
      apiMonthlyCalls: 500_000,
      teamMembers: 10,
      slaSupport: "priority",
    },
    {
      name: "enterprise",
      displayName: "Enterprise",
      priceMonthlyUsd: null,
      maxItemsPerScan: null,
      textDetection: true,
      imageDetection: true,
      fixDashboard: true,
      auditLog: true,
      auditLogPdfExport: true,
      monthlyAutoScan: true,
      rewriteEngine: true,
      maxShops: null,
      whiteLabelReports: true,
      apiAccess: true,
      apiMonthlyCalls: null,
      teamMembers: 99,
      slaSupport: "dedicated",
    },
  ];

  for (const p of plans) {
    await prisma.plan.upsert({
      where: { name: p.name },
      create: {
        name: p.name,
        displayName: p.displayName,
        priceMonthlyUsd: p.priceMonthlyUsd,
        maxItemsPerScan: p.maxItemsPerScan,
        textDetection: p.textDetection,
        imageDetection: p.imageDetection,
        fixDashboard: p.fixDashboard,
        auditLog: p.auditLog,
        auditLogPdfExport: p.auditLogPdfExport,
        monthlyAutoScan: p.monthlyAutoScan,
        rewriteEngine: p.rewriteEngine,
        maxShops: p.maxShops,
        whiteLabelReports: p.whiteLabelReports,
        apiAccess: p.apiAccess,
        apiMonthlyCalls: p.apiMonthlyCalls,
        teamMembers: p.teamMembers,
        slaSupport: p.slaSupport,
        active: true,
      },
      update: {
        displayName: p.displayName,
        priceMonthlyUsd: p.priceMonthlyUsd,
        maxItemsPerScan: p.maxItemsPerScan,
        textDetection: p.textDetection,
        imageDetection: p.imageDetection,
        fixDashboard: p.fixDashboard,
        auditLog: p.auditLog,
        auditLogPdfExport: p.auditLogPdfExport,
        monthlyAutoScan: p.monthlyAutoScan,
        rewriteEngine: p.rewriteEngine,
        maxShops: p.maxShops,
        whiteLabelReports: p.whiteLabelReports,
        apiAccess: p.apiAccess,
        apiMonthlyCalls: p.apiMonthlyCalls,
        teamMembers: p.teamMembers,
        slaSupport: p.slaSupport,
      },
    });
  }
}

async function seedCertificationRegistries() {
  const rows = [
    {
      code: "bcorp",
      displayName: "B Corporation",
      issuingBody: "B Lab",
      lookupMethod: "url_scrape",
      urlPattern: "https://www.bcorporation.net/en-us/find-a-b-corp/company/{cert_number}",
    },
    {
      code: "fsc",
      displayName: "Forest Stewardship Council",
      issuingBody: "FSC",
      lookupMethod: "url_scrape",
      urlPattern: "https://info.fsc.org/certificate.php?code={cert_number}",
    },
    {
      code: "carbon_trust",
      displayName: "Carbon Trust",
      issuingBody: "Carbon Trust",
      lookupMethod: "url_scrape",
    },
    {
      code: "gots",
      displayName: "Global Organic Textile Standard",
      issuingBody: "GOTS",
      lookupMethod: "url_scrape",
    },
    {
      code: "rainforest_alliance",
      displayName: "Rainforest Alliance",
      issuingBody: "Rainforest Alliance",
      lookupMethod: "url_scrape",
    },
    {
      code: "energy_star",
      displayName: "ENERGY STAR",
      issuingBody: "EPA",
      lookupMethod: "url_scrape",
    },
  ];

  for (const r of rows) {
    await prisma.certificationRegistryConfig.upsert({
      where: { code: r.code },
      create: {
        code: r.code,
        displayName: r.displayName,
        issuingBody: r.issuingBody,
        lookupMethod: r.lookupMethod,
        urlPattern: r.urlPattern ?? null,
        active: true,
      },
      update: {
        displayName: r.displayName,
        issuingBody: r.issuingBody,
        lookupMethod: r.lookupMethod,
        urlPattern: r.urlPattern ?? null,
      },
    });
  }
}

async function seedPromptTemplates() {
  await prisma.promptTemplate.upsert({
    where: { name: "substantiate_green_claims" },
    create: {
      name: "substantiate_green_claims",
      content: `You classify green marketing claims for a product.
Product description:
---
{{product_description}}
---
Flagged phrases: {{flagged_phrases}}
For each phrase, respond with SUBSTANTIATED only if the description gives concrete, verifiable support (specific cert, measurable claim, named standard). Otherwise BARE_ASSERTION.
Return JSON only: {"results":[{"phrase":"...","status":"SUBSTANTIATED"|"BARE_ASSERTION"}]}`,
      isActive: true,
    },
    update: {
      isActive: true,
    },
  });
}

async function main() {
  await seedPlans();
  await seedCertificationRegistries();
  await seedPromptTemplates();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
