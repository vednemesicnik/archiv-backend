import { PrismaClient } from "@prisma/client"
import cuid = require("cuid")

const prisma = new PrismaClient()

const issues = [
  {
    ordinalNumber: 4,
    month: 12,
    year: 2019,
  },
  {
    ordinalNumber: 3,
    month: 10,
    year: 2019,
  },
  {
    ordinalNumber: 2,
    month: 5,
    year: 2019,
  },
  {
    ordinalNumber: 1,
    month: 3,
    year: 2019,
  },
  {
    ordinalNumber: 4,
    month: 11,
    year: 2020,
  },
  {
    ordinalNumber: 3,
    month: 9,
    year: 2020,
  },
  {
    ordinalNumber: 2,
    month: 4,
    year: 2020,
  },
  {
    ordinalNumber: 1,
    month: 1,
    year: 2020,
  },
]

async function main() {
  issues.forEach((issue) => {
    const generateIssue = async () => {
      await prisma.issue.create({
        data: {
          id: cuid(),
          code: `${issue.year}-${issue.ordinalNumber}-${issue.month}`,
          cover: `some path to cover image`,
          ...issue,
        },
      })
    }

    generateIssue()
  })

  const allIssues = await prisma.issue.findMany({
    orderBy: { code: "asc" },
  })

  console.table(allIssues)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
