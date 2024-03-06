/*
  Warnings:

  - You are about to drop the column `quntity` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "situation" TEXT NOT NULL DEFAULT A,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Employee" ("cpf", "createdAt", "id", "name", "situation") SELECT "cpf", "createdAt", "id", "name", "situation" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quantity" INTEGER NOT NULL
);
INSERT INTO "new_Ticket" ("id") SELECT "id" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_id_key" ON "Ticket"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
