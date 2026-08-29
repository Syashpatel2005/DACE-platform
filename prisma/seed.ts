import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



async function seedSubject(subjectName: string, order: number, topicNames: string[]) {
  const subject = await prisma.subject.upsert({
    where: { slug: slugify(subjectName) },
    update: {},
    create: {
      name: subjectName,
      slug: slugify(subjectName),
      order,
    },
  });

  for (let i = 0; i < topicNames.length; i++) {
    const topicName = topicNames[i];
    await prisma.topic.upsert({
      where: {
        subjectId_slug: {
          subjectId: subject.id,
          slug: slugify(topicName),
        },
      },
      update: {},
      create: {
        name: topicName,
        slug: slugify(topicName),
        order: i,
        subjectId: subject.id,
      },
    });
  }

  console.log(`Seeded "${subjectName}" with ${topicNames.length} topics`);
}

async function main() {
  console.log("Starting seed...");

  // Subject 1: Probability and Statistics
  await seedSubject("Probability and Statistics", 1, [
    "Counting",
    "Permutation and Combination",
    "Probability axioms",
    "Sample space",
    "Events",
    "Independent events",
    "Mutually exclusive events",
    "Marginal probability",
    "Conditional probability",
    "Joint probability",
    "Bayes theorem",
    "Conditional expectation",
    "Conditional variance",
    "Mean",
    "Median",
    "Mode",
    "Standard deviation",
    "Correlation",
    "Covariance",
    "Random variables",
    "Discrete random variables",
    "Probability mass functions",
    "Uniform distribution",
    "Bernoulli distribution",
    "Binomial distribution",
    "Continuous random variables",
    "Probability distribution function",
    "Continuous uniform distribution",
    "Exponential distribution",
    "Poisson distribution",
    "Normal distribution",
    "Standard normal distribution",
    "t-distribution",
    "Chi-squared distribution",
    "Cumulative distribution function",
    "Conditional PDF",
    "Central Limit Theorem",
    "Confidence interval",
    "z-test",
    "t-test",
    "Chi-squared test",
  ]);

  // Subject 2: Linear Algebra
  await seedSubject("Linear Algebra", 2, [
    "Vector spaces",
    "Subspaces",
    "Linear dependence",
    "Linear independence",
    "Matrices",
    "Projection matrices",
    "Orthogonal matrices",
    "Idempotent matrices",
    "Partition matrices",
    "Properties of matrices",
    "Quadratic forms",
    "Systems of linear equations",
    "Gaussian elimination",
    "Eigenvalues",
    "Eigenvectors",
    "Determinant",
    "Rank",
    "Nullity",
    "Projections",
    "LU decomposition",
    "Singular Value Decomposition",
  ]);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });