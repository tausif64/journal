// scripts/export-mysql.ts

import { PrismaClient } from "../lib/generated/prisma";
import { writeFileSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  console.log("Exporting MySQL data...");

  const [
    users,
    accounts,
    sessions,
    verifications,
    journals,
    volumes,
    issues,
    articles,
    articleAuthors,
    payments,
    reviews,
    testimonials,
    carouselSlides,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.account.findMany(),
    prisma.session.findMany(),
    prisma.verification.findMany(),
    prisma.journal.findMany(),
    prisma.volume.findMany(),
    prisma.issue.findMany(),
    prisma.article.findMany(),
    prisma.articleAuthor.findMany(),
    prisma.payment.findMany(),
    prisma.review.findMany(),
    prisma.testimonial.findMany(),
    prisma.carouselSlide.findMany(),
  ]);

  const seedData = {
    users,
    accounts,
    sessions,
    verifications,
    journals,
    volumes,
    issues,
    articles,
    articleAuthors,
    payments,
    reviews,
    testimonials,
    carouselSlides,
  };

  writeFileSync(
    "./prisma/seed-data.json",
    JSON.stringify(seedData, null, 2),
    "utf8"
  );

  console.log("✅ Export complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });