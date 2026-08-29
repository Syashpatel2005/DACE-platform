-- CreateTable
CREATE TABLE "ExamRules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "durationMin" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "gaMarks" INTEGER NOT NULL,
    "daMarks" INTEGER NOT NULL,
    "mcq1MarkWrongPenalty" DOUBLE PRECISION NOT NULL,
    "mcq2MarkWrongPenalty" DOUBLE PRECISION NOT NULL,
    "msqNegativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "natNegativeMarking" BOOLEAN NOT NULL DEFAULT false,
    "fullMockQuestionCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamRules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamRules_isActive_idx" ON "ExamRules"("isActive");
