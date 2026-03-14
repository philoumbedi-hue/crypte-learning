-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "learningObjectives" TEXT,
ADD COLUMN     "theoryContent" TEXT;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "description" TEXT,
ADD COLUMN     "maxAttempts" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "passingScore" INTEGER,
ADD COLUMN     "timeLimit" INTEGER,
ADD COLUMN     "weight" INTEGER;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT;
