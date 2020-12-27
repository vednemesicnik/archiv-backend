import { PrismaClient } from "@prisma/client"
import { ApolloServerExpressConfig, gql } from "apollo-server-express"

const prisma = new PrismaClient()

const typeDefs = gql`
  type Issue {
    id: ID
    code: String
    ordinalNumber: Int
    month: Int
    year: Int
    cover: String
  }

  type Query {
    issues(year: Int): [Issue]
    issue(id: ID!): Issue
  }
`

export const config: ApolloServerExpressConfig = {
  typeDefs,
  resolvers: {
    Query: {
      issues: async (_source, args) => {
        if (args.year) {
          return await prisma.issue.findMany({
            orderBy: { code: "asc" },
            where: {
              year: args.year,
            },
          })
        }

        return await prisma.issue.findMany({
          orderBy: { code: "asc" },
        })
      },
      issue: async (_source, args) => {
        return await prisma.issue.findOne({
          where: {
            id: args.id,
          },
        })
      },
    },
  },
}
