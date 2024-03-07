-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "situation" TEXT NOT NULL DEFAULT A,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_Employee" ("cpf", "createdAt", "id", "name", "situation") SELECT "cpf", "createdAt", "id", "name", "situation" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
