import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateFingerprint } from "../lib/fingerprint";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type Difficulty = "EASY" | "MEDIUM" | "MEDIUM_HARD" | "HARD" | "VERY_HARD";

type QuestionSeed = {
  subjectSlug: string;
  topicName: string;
  questionText: string;
  difficulty: Difficulty;
  marks: 1 | 2;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const questions: QuestionSeed[] = [
  // ---------------- Probability and Statistics ----------------
  {
    subjectSlug: "probability-and-statistics",
    topicName: "Bayes theorem",
    questionText:
      "If P(A)=0.3, P(B)=0.5, and P(A∩B)=0.15, are events A and B independent?",
    difficulty: "EASY",
    marks: 1,
    options: [
      "Yes, since P(A∩B) = P(A) x P(B)",
      "No, since P(A∩B) ≠ P(A) x P(B)",
      "Cannot be determined from the given information",
      "Only if A and B are mutually exclusive",
    ],
    correctAnswer: 0,
    explanation:
      "P(A) x P(B) = 0.3 x 0.5 = 0.15, which equals the given P(A∩B). Since this equality holds, A and B are independent.",
  },
  {
    subjectSlug: "probability-and-statistics",
    topicName: "Conditional probability",
    questionText:
      "A fair six-sided die is rolled. Given that the result is even, what is the probability that it is greater than 4?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["1/6", "1/3", "1/2", "2/3"],
    correctAnswer: 1,
    explanation:
      "Even outcomes are {2, 4, 6}. Among these, only 6 is greater than 4. So the conditional probability is 1/3.",
  },
  {
    subjectSlug: "probability-and-statistics",
    topicName: "Normal distribution",
    questionText: "For a standard normal distribution, what is P(Z ≤ 0)?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["0", "0.25", "0.5", "1"],
    correctAnswer: 2,
    explanation:
      "The standard normal distribution is symmetric about 0, so exactly half the probability mass lies at or below 0, giving P(Z ≤ 0) = 0.5.",
  },
  {
    subjectSlug: "probability-and-statistics",
    topicName: "Binomial distribution",
    questionText:
      "A biased coin has P(heads) = 0.6. What is the probability of getting exactly 2 heads in 3 tosses?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: ["0.288", "0.36", "0.432", "0.6"],
    correctAnswer: 2,
    explanation:
      "Using the binomial formula C(3,2) x 0.6^2 x 0.4^1 = 3 x 0.36 x 0.4 = 0.432.",
  },
  {
    subjectSlug: "probability-and-statistics",
    topicName: "Central Limit Theorem",
    questionText:
      "According to the Central Limit Theorem, as sample size n increases, the sampling distribution of the sample mean approaches:",
    difficulty: "HARD",
    marks: 2,
    options: [
      "A uniform distribution regardless of the population distribution",
      "A normal distribution regardless of the population distribution (for large n)",
      "The same distribution as the population",
      "A binomial distribution",
    ],
    correctAnswer: 1,
    explanation:
      "The CLT states that regardless of the population's original distribution, the sampling distribution of the mean approaches a normal distribution as sample size grows large.",
  },

  // ---------------- Linear Algebra ----------------
  {
    subjectSlug: "linear-algebra",
    topicName: "Determinant",
    questionText: "What is the determinant of a 3x3 identity matrix?",
    difficulty: "EASY",
    marks: 1,
    options: ["0", "1", "3", "9"],
    correctAnswer: 1,
    explanation:
      "The determinant of any n x n identity matrix is always 1, since it is diagonal with all entries equal to 1.",
  },
  {
    subjectSlug: "linear-algebra",
    topicName: "Rank",
    questionText: "A 4x4 matrix has rank 4. What can you conclude about the matrix?",
    difficulty: "MEDIUM",
    marks: 1,
    options: [
      "It is singular (non-invertible)",
      "It is invertible (full rank)",
      "It has infinitely many solutions for Ax = 0",
      "Its determinant is 0",
    ],
    correctAnswer: 1,
    explanation:
      "A square matrix with rank equal to its size (full rank) is always invertible, since its columns are linearly independent.",
  },
  {
    subjectSlug: "linear-algebra",
    topicName: "Eigenvalues",
    questionText: "What are the eigenvalues of the matrix [[3, 0], [0, -2]]?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["3 and -2", "-3 and 2", "0 and 1", "3 and 2"],
    correctAnswer: 0,
    explanation:
      "For a diagonal matrix, the eigenvalues are exactly the diagonal entries: 3 and -2.",
  },
  {
    subjectSlug: "linear-algebra",
    topicName: "Linear independence",
    questionText: "Which set of vectors in R^3 is linearly independent?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: [
      "(1,0,0), (0,1,0), (1,1,0)",
      "(1,2,3), (2,4,6), (0,0,1)",
      "(1,0,0), (0,1,0), (0,0,1)",
      "(1,1,1), (2,2,2), (3,3,3)",
    ],
    correctAnswer: 2,
    explanation:
      "Option C is the standard basis of R^3, which is always linearly independent. In A, the third vector equals the sum of the first two. In B, the second vector is twice the first. In D, all vectors are scalar multiples of each other.",
  },
  {
    subjectSlug: "linear-algebra",
    topicName: "Singular Value Decomposition",
    questionText: "In the SVD of a matrix A = UΣV^T, the columns of U are:",
    difficulty: "HARD",
    marks: 2,
    options: [
      "Eigenvectors of A^T A",
      "Eigenvectors of A A^T",
      "The singular values of A",
      "Eigenvectors of A",
    ],
    correctAnswer: 1,
    explanation:
      "The columns of U (left singular vectors) are the eigenvectors of A A^T, while the columns of V (right singular vectors) are the eigenvectors of A^T A.",
  },

  // ---------------- Calculus and Optimization ----------------
  {
    subjectSlug: "calculus-and-optimization",
    topicName: "Limits",
    questionText: "What is lim (x→0) sin(x)/x?",
    difficulty: "EASY",
    marks: 1,
    options: ["0", "1", "Infinity", "Undefined"],
    correctAnswer: 1,
    explanation:
      "This is a standard limit result: lim(x→0) sin(x)/x = 1, provable via the squeeze theorem or L'Hopital's rule.",
  },
  {
    subjectSlug: "calculus-and-optimization",
    topicName: "Continuity",
    questionText: "A function f(x) is continuous at x = a if:",
    difficulty: "EASY",
    marks: 1,
    options: [
      "f(a) exists only",
      "lim(x→a) f(x) exists only",
      "lim(x→a) f(x) = f(a)",
      "f is differentiable at a",
    ],
    correctAnswer: 2,
    explanation:
      "Continuity at a point requires that the function's value equals its limit at that point: lim(x→a) f(x) = f(a). Differentiability is a stronger condition, not required for continuity.",
  },
  {
    subjectSlug: "calculus-and-optimization",
    topicName: "Maxima",
    questionText: "For f(x) = -x^2 + 4x + 1, at what value of x does f attain its maximum?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["1", "2", "4", "-2"],
    correctAnswer: 1,
    explanation:
      "Setting f'(x) = -2x + 4 = 0 gives x = 2. Since f''(x) = -2 < 0, this is a maximum.",
  },
  {
    subjectSlug: "calculus-and-optimization",
    topicName: "Taylor series",
    questionText:
      "The Taylor series expansion of e^x around x = 0, up to the x^2 term, is:",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: ["1 + x + x^2", "1 + x + x^2/2", "1 + x^2/2", "x + x^2/2"],
    correctAnswer: 1,
    explanation:
      "The Maclaurin series for e^x is 1 + x + x^2/2! + x^3/3! + ..., so up to the x^2 term it is 1 + x + x^2/2.",
  },
  {
    subjectSlug: "calculus-and-optimization",
    topicName: "Single-variable optimization",
    questionText:
      "For f(x) = x^3 - 3x, which statement about its critical points is correct?",
    difficulty: "HARD",
    marks: 2,
    options: [
      "x=1 is a local maximum, x=-1 is a local minimum",
      "x=1 is a local minimum, x=-1 is a local maximum",
      "Both x=1 and x=-1 are local minima",
      "Both x=1 and x=-1 are local maxima",
    ],
    correctAnswer: 1,
    explanation:
      "f'(x) = 3x^2 - 3 = 0 gives x = ±1. f''(x) = 6x. At x=1, f''=6>0 (local minimum). At x=-1, f''=-6<0 (local maximum).",
  },

  // ---------------- Programming, Data Structures and Algorithms ----------------
  {
    subjectSlug: "programming-data-structures-and-algorithms",
    topicName: "Binary search",
    questionText:
      "What is the time complexity of binary search on a sorted array of n elements?",
    difficulty: "EASY",
    marks: 1,
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation:
      "Binary search repeatedly halves the search space, giving a time complexity of O(log n).",
  },
  {
    subjectSlug: "programming-data-structures-and-algorithms",
    topicName: "Stack",
    questionText:
      "Which data structure follows the Last-In-First-Out (LIFO) principle?",
    difficulty: "EASY",
    marks: 1,
    options: ["Queue", "Stack", "Linked list", "Tree"],
    correctAnswer: 1,
    explanation:
      "A stack follows LIFO: the most recently inserted element is the first one removed.",
  },
  {
    subjectSlug: "programming-data-structures-and-algorithms",
    topicName: "Merge sort",
    questionText: "What is the worst-case time complexity of merge sort?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    correctAnswer: 1,
    explanation:
      "Merge sort always divides the array in half and merges in linear time, giving O(n log n) in the best, average, and worst cases.",
  },
  {
    subjectSlug: "programming-data-structures-and-algorithms",
    topicName: "Quick sort",
    questionText:
      "What is the worst-case time complexity of quicksort, and when does it typically occur?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: [
      "O(n log n), when the pivot is always the median",
      "O(n^2), when the pivot is always the smallest or largest element",
      "O(n^2), only when the array is already sorted and a random pivot is used",
      "O(log n), always",
    ],
    correctAnswer: 1,
    explanation:
      "Quicksort degrades to O(n^2) when the chosen pivot consistently ends up being the smallest or largest element (e.g., always picking the first element on an already-sorted array), causing maximally unbalanced partitions.",
  },
  {
    subjectSlug: "programming-data-structures-and-algorithms",
    topicName: "Shortest path algorithms",
    questionText:
      "Dijkstra's algorithm fails to give correct shortest paths when the graph contains:",
    difficulty: "HARD",
    marks: 2,
    options: [
      "Negative edge weights",
      "Cycles",
      "Disconnected components",
      "Undirected edges",
    ],
    correctAnswer: 0,
    explanation:
      "Dijkstra's algorithm assumes all edge weights are non-negative; negative edge weights can cause it to produce incorrect shortest-path results.",
  },

  // ---------------- Database Management and Warehousing ----------------
  {
    subjectSlug: "database-management-and-warehousing",
    topicName: "Normal forms",
    questionText: "A relation is in 1NF (First Normal Form) if:",
    difficulty: "EASY",
    marks: 1,
    options: [
      "It has no partial dependency",
      "All attributes contain atomic (indivisible) values",
      "It has no transitive dependency",
      "Every determinant is a candidate key",
    ],
    correctAnswer: 1,
    explanation:
      "1NF requires that every attribute holds only atomic, indivisible values — no repeating groups or multi-valued attributes.",
  },
  {
    subjectSlug: "database-management-and-warehousing",
    topicName: "SQL",
    questionText: "Which SQL clause is used to filter groups after aggregation?",
    difficulty: "EASY",
    marks: 1,
    options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
    correctAnswer: 2,
    explanation:
      "HAVING filters groups after GROUP BY aggregation, whereas WHERE filters individual rows before grouping.",
  },
  {
    subjectSlug: "database-management-and-warehousing",
    topicName: "Relational algebra",
    questionText:
      "Which relational algebra operation combines tuples from two relations based on a common attribute?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["Union", "Selection", "Join", "Projection"],
    correctAnswer: 2,
    explanation:
      "Join combines tuples from two relations based on a related attribute between them, unlike selection (filters rows) or projection (filters columns).",
  },
  {
    subjectSlug: "database-management-and-warehousing",
    topicName: "Indexing",
    questionText:
      "A B+ tree index primarily improves the performance of which type of query?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: [
      "Full table scans only",
      "Range queries and equality lookups",
      "Only INSERT operations",
      "Only DELETE operations",
    ],
    correctAnswer: 1,
    explanation:
      "B+ tree indexes maintain sorted order with linked leaf nodes, making them efficient for both equality lookups and range queries.",
  },
  {
    subjectSlug: "database-management-and-warehousing",
    topicName: "Normalization",
    questionText:
      "A relation R(A,B,C,D) has functional dependencies A→B, B→C, C→D, where A is the only candidate key. What is the highest normal form R satisfies?",
    difficulty: "HARD",
    marks: 2,
    options: ["4NF", "3NF", "2NF", "1NF only"],
    correctAnswer: 2,
    explanation:
      "Since A→B→C→D forms a transitive dependency chain (C and D depend on A only through B and C respectively), R violates 3NF. With a single-attribute key there's no partial dependency issue, so R satisfies 2NF but not 3NF.",
  },

  // ---------------- Machine Learning ----------------
  {
    subjectSlug: "machine-learning",
    topicName: "Bias-variance trade-off",
    questionText: "A model with high bias and low variance is most likely to:",
    difficulty: "EASY",
    marks: 1,
    options: [
      "Overfit the training data",
      "Underfit both training and test data",
      "Perform perfectly on training data but poorly on test data",
      "Have zero training error",
    ],
    correctAnswer: 1,
    explanation:
      "High bias means the model makes overly strong simplifying assumptions, failing to capture the underlying pattern in both training and test data — this is underfitting.",
  },
  {
    subjectSlug: "machine-learning",
    topicName: "K-nearest neighbours",
    questionText: "In KNN classification, what happens when K = 1?",
    difficulty: "EASY",
    marks: 1,
    options: [
      "The model always predicts the majority class",
      "The prediction is based on the single closest training point",
      "The model becomes a linear classifier",
      "K=1 is not a valid choice",
    ],
    correctAnswer: 1,
    explanation:
      "With K=1, KNN assigns the class of the single nearest neighbor, making it highly sensitive to noise (low bias, high variance).",
  },
  {
    subjectSlug: "machine-learning",
    topicName: "K-fold cross validation",
    questionText:
      "In 5-fold cross-validation, what fraction of the data is used for validation in each fold?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["1/5", "4/5", "1/2", "It varies by fold"],
    correctAnswer: 0,
    explanation:
      "In k-fold cross-validation, the data is split into k equal parts; each fold holds out 1/k of the data (1/5 here) for validation and trains on the rest.",
  },
  {
    subjectSlug: "machine-learning",
    topicName: "Naive Bayes",
    questionText: "The 'naive' assumption in Naive Bayes refers to:",
    difficulty: "MEDIUM",
    marks: 1,
    options: [
      "Assuming all classes are equally likely",
      "Assuming features are conditionally independent given the class",
      "Assuming the data follows a normal distribution",
      "Assuming there are only two classes",
    ],
    correctAnswer: 1,
    explanation:
      "Naive Bayes assumes all features are conditionally independent of one another given the class label — an assumption rarely fully true, but effective in practice.",
  },
  {
    subjectSlug: "machine-learning",
    topicName: "PCA",
    questionText: "In PCA, the first principal component is the direction that:",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: [
      "Minimizes the variance of the projected data",
      "Maximizes the variance of the projected data",
      "Is orthogonal to all other features",
      "Always aligns with the feature having the largest original variance",
    ],
    correctAnswer: 1,
    explanation:
      "The first principal component is defined as the direction along which the projected data has maximum variance. It is not necessarily the same as any single original feature's axis.",
  },

  // ---------------- Artificial Intelligence ----------------
  {
    subjectSlug: "artificial-intelligence",
    topicName: "Uninformed search",
    questionText: "Which of the following is an uninformed search strategy?",
    difficulty: "EASY",
    marks: 1,
    options: ["A* search", "Breadth-First Search", "Greedy Best-First Search", "Hill Climbing"],
    correctAnswer: 1,
    explanation:
      "Breadth-First Search explores the search space without using any heuristic information, making it an uninformed (blind) search strategy.",
  },
  {
    subjectSlug: "artificial-intelligence",
    topicName: "Informed search",
    questionText: "In A* search, the evaluation function f(n) is defined as:",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["f(n) = g(n)", "f(n) = h(n)", "f(n) = g(n) + h(n)", "f(n) = g(n) - h(n)"],
    correctAnswer: 2,
    explanation:
      "A* combines the cost so far (g(n)) and the estimated cost to the goal (h(n)) into f(n) = g(n) + h(n), guiding search toward optimal paths when h is admissible.",
  },
  {
    subjectSlug: "artificial-intelligence",
    topicName: "Adversarial search",
    questionText: "In the minimax algorithm, the MAX player aims to:",
    difficulty: "MEDIUM",
    marks: 1,
    options: [
      "Minimize the opponent's score",
      "Maximize its own minimum guaranteed score",
      "Randomly select moves",
      "Always choose the first available move",
    ],
    correctAnswer: 1,
    explanation:
      "MAX chooses moves to maximize its own guaranteed outcome, assuming the opponent (MIN) always plays to minimize MAX's score.",
  },
  {
    subjectSlug: "artificial-intelligence",
    topicName: "Propositional logic",
    questionText: "Which of the following is a tautology?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: ["P ∧ ¬P", "P ∨ ¬P", "P → Q", "P ∧ Q"],
    correctAnswer: 1,
    explanation:
      "P ∨ ¬P is always true regardless of P's truth value (law of excluded middle), making it a tautology.",
  },
  {
    subjectSlug: "artificial-intelligence",
    topicName: "Variable elimination",
    questionText:
      "In Bayesian network inference, the variable elimination algorithm primarily helps to:",
    difficulty: "HARD",
    marks: 2,
    options: [
      "Reduce the number of nodes in the network",
      "Compute exact marginal probabilities efficiently by eliminating variables in a chosen order",
      "Learn the structure of the network from data",
      "Sample from the joint distribution",
    ],
    correctAnswer: 1,
    explanation:
      "Variable elimination computes exact marginal probabilities by systematically summing out (eliminating) variables in an order chosen to minimize computational cost.",
  },

  // ---------------- General Aptitude ----------------
  {
    subjectSlug: "general-aptitude",
    topicName: "Quantitative aptitude",
    questionText: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
    difficulty: "EASY",
    marks: 1,
    options: ["60 km/h", "75 km/h", "80 km/h", "90 km/h"],
    correctAnswer: 2,
    explanation:
      "Speed = distance / time = 60 km / (45/60 h) = 60 / 0.75 = 80 km/h.",
  },
  {
    subjectSlug: "general-aptitude",
    topicName: "Logical reasoning",
    questionText: "Find the odd one out: Apple, Banana, Carrot, Mango",
    difficulty: "EASY",
    marks: 1,
    options: ["Apple", "Banana", "Carrot", "Mango"],
    correctAnswer: 2,
    explanation:
      "Carrot is a vegetable, while Apple, Banana, and Mango are all fruits.",
  },
  {
    subjectSlug: "general-aptitude",
    topicName: "Verbal aptitude",
    questionText: "Choose the word most nearly OPPOSITE in meaning to 'Frugal':",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["Thrifty", "Wasteful", "Economical", "Stingy"],
    correctAnswer: 1,
    explanation:
      "'Frugal' means careful with money/resources. Its opposite is 'Wasteful'. The other options are synonyms of frugal.",
  },
  {
    subjectSlug: "general-aptitude",
    topicName: "Numerical reasoning",
    questionText: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    difficulty: "MEDIUM",
    marks: 1,
    options: ["36", "40", "42", "44"],
    correctAnswer: 2,
    explanation:
      "The differences between consecutive terms are 4, 6, 8, 10, 12 (increasing by 2 each time), so the next term is 30 + 12 = 42.",
  },
  {
    subjectSlug: "general-aptitude",
    topicName: "Data interpretation",
    questionText:
      "In a class, 60% of students are boys. If there are 24 girls, how many total students are in the class?",
    difficulty: "MEDIUM_HARD",
    marks: 2,
    options: ["48", "54", "60", "72"],
    correctAnswer: 2,
    explanation:
      "Girls make up 40% of the class. If 40% = 24, then total = 24 / 0.4 = 60 students.",
  },
];

async function main() {
  console.log(`Seeding ${questions.length} questions...`);
  let created = 0;
  let skipped = 0;
  let missing = 0;

  for (const q of questions) {
    const subject = await prisma.subject.findUnique({
      where: { slug: q.subjectSlug },
    });
    if (!subject) {
      console.warn(`⚠ Subject not found: "${q.subjectSlug}" — skipping question`);
      missing++;
      continue;
    }

    const topic = await prisma.topic.findFirst({
      where: { subjectId: subject.id, name: q.topicName },
    });
    if (!topic) {
      console.warn(
        `⚠ Topic "${q.topicName}" not found under "${q.subjectSlug}" — skipping question`
      );
      missing++;
      continue;
    }

    const fingerprint = generateFingerprint(q.questionText);
    const existing = await prisma.question.findUnique({ where: { fingerprint } });
    if (existing) {
      skipped++;
      continue;
    }

    await prisma.question.create({
      data: {
        questionText: q.questionText,
        questionType: "MCQ",
        subjectId: subject.id,
        topicId: topic.id,
        difficulty: q.difficulty,
        marks: q.marks,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        sourceType: "MANUAL",
        status: "APPROVED",
        fingerprint,
      },
    });
    created++;
  }

  console.log(
    `Done. Created ${created}, skipped ${skipped} (already existed), ${missing} missing subject/topic.`
  );
}

main()
  .catch((e) => {
    console.error("Question seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });