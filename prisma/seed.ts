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
  // Subject 3: Calculus and Optimization
await seedSubject("Calculus and Optimization", 3, [
  "Functions of a single variable",
  "Limits",
  "Continuity",
  "Differentiability",
  "Taylor series",
  "Maxima",
  "Minima",
  "Single-variable optimization",
]);

// Subject 4: Programming, Data Structures and Algorithms
await seedSubject("Programming, Data Structures and Algorithms", 4, [
  "Python",
  "Stack",
  "Queue",
  "Linked list",
  "Trees",
  "Hash tables",
  "Linear search",
  "Binary search",
  "Selection sort",
  "Bubble sort",
  "Insertion sort",
  "Merge sort",
  "Quick sort",
  "Basic graph theory",
  "Graph traversal",
  "Shortest path algorithms",
]);

// Subject 5: Database Management and Warehousing
await seedSubject("Database Management and Warehousing", 5, [
  "ER model",
  "Relational model",
  "Relational algebra",
  "Tuple calculus",
  "SQL",
  "Integrity constraints",
  "Normal forms",
  "File organization",
  "Indexing",
  "Data types",
  "Data transformation",
  "Normalization",
  "Discretization",
  "Sampling",
  "Compression",
  "Data warehouse modelling",
  "Multidimensional data models",
  "Concept hierarchies",
  "Measures",
  "Measure categorization",
  "Measure computations",
]);
// Subject 6: Machine Learning
await seedSubject("Machine Learning", 6, [
  "Regression",
  "Classification",
  "Simple linear regression",
  "Multiple linear regression",
  "Ridge regression",
  "Logistic regression",
  "K-nearest neighbours",
  "Naive Bayes",
  "Linear discriminant analysis",
  "Support vector machine",
  "Decision trees",
  "Bias-variance trade-off",
  "Leave-one-out cross validation",
  "K-fold cross validation",
  "Multilayer perceptron",
  "Feed-forward neural network",
  "Clustering",
  "K-means",
  "K-medoids",
  "Hierarchical clustering",
  "Top-down clustering",
  "Bottom-up clustering",
  "Single linkage",
  "Multiple linkage",
  "Dimensionality reduction",
  "PCA",
]);

// Subject 7: Artificial Intelligence
await seedSubject("Artificial Intelligence", 7, [
  "Uninformed search",
  "Informed search",
  "Adversarial search",
  "Propositional logic",
  "Predicate logic",
  "Reasoning under uncertainty",
  "Conditional independence representation",
  "Variable elimination",
  "Approximate inference through sampling",
]);

// Subject 8: General Aptitude
await seedSubject("General Aptitude", 8, [
  "Verbal aptitude",
  "Quantitative aptitude",
  "Logical reasoning",
  "Numerical reasoning",
  "Data interpretation",
  "Basic analytical reasoning",
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