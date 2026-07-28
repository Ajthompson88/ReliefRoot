-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Effect" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Effect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionMetric" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "metricId" TEXT NOT NULL,
    "beforeValue" INTEGER NOT NULL,
    "afterValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionEffect" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "effectId" TEXT NOT NULL,
    "intensity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionEffect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_name_key" ON "Metric"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Effect_name_key" ON "Effect"("name");

-- CreateIndex
CREATE INDEX "SessionMetric_sessionId_idx" ON "SessionMetric"("sessionId");

-- CreateIndex
CREATE INDEX "SessionMetric_metricId_idx" ON "SessionMetric"("metricId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionMetric_sessionId_metricId_key" ON "SessionMetric"("sessionId", "metricId");

-- CreateIndex
CREATE INDEX "SessionEffect_sessionId_idx" ON "SessionEffect"("sessionId");

-- CreateIndex
CREATE INDEX "SessionEffect_effectId_idx" ON "SessionEffect"("effectId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionEffect_sessionId_effectId_key" ON "SessionEffect"("sessionId", "effectId");

-- AddForeignKey
ALTER TABLE "SessionMetric" ADD CONSTRAINT "SessionMetric_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMetric" ADD CONSTRAINT "SessionMetric_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEffect" ADD CONSTRAINT "SessionEffect_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionEffect" ADD CONSTRAINT "SessionEffect_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "Effect"("id") ON DELETE CASCADE ON UPDATE CASCADE;
