import express from "express"
import { ApolloServer } from "apollo-server-express"
import { config } from "./graphql/apollo-config"
import multer from "multer"
import fs from "fs"

const app = express()
const server = new ApolloServer(config)

server.applyMiddleware({ app })

app.use(express.json())

// It serve endpoint to upload cover image
const ROOT_FOLDER = "public"
const FILES_FOLDER = `issues`
const FIELD_NAME = {
  cover: "cover",
  pdf: "pdf",
}

const storage = multer.diskStorage({
  destination: `${ROOT_FOLDER}/${FILES_FOLDER}/`,
  filename: function (req, file, cb) {
    const folderName = req.params.issueId

    if (!fs.existsSync(`${ROOT_FOLDER}/${FILES_FOLDER}/${folderName}`)) {
      fs.mkdirSync(`${ROOT_FOLDER}/${FILES_FOLDER}/${folderName}`)
    }

    cb(null, `${folderName}/${file.originalname}`)
  },
})

const upload = multer({ storage })

app.post(
  "/upload-files/:issueId",
  upload.fields([
    { name: FIELD_NAME.cover, maxCount: 1 },
    { name: FIELD_NAME.pdf, maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const files = req.files as { [fieldName: string]: Express.Multer.File[] }

      let coverImage = undefined
      let pdfFile = undefined

      if (typeof files === "object") {
        coverImage = files[FIELD_NAME.cover][0]
        pdfFile = files[FIELD_NAME.pdf][0]
      }

      let responseObject: {
        status: boolean
        data: { name: string; path: string }[]
      } = { status: false, data: [] }

      if (coverImage && pdfFile) {
        responseObject = {
          status: true,
          data: [
            {
              name: "cover",
              path: coverImage.path.replace(`${ROOT_FOLDER}/`, ""),
            },
            {
              name: "pdf",
              path: pdfFile.path.replace(`${ROOT_FOLDER}/`, ""),
            },
          ],
        }
      }

      res.send(responseObject)
    } catch (error) {
      res.status(500).send(error)
    }
  }
)

// It serves the folder with cover images
app.use(express.static(`${__dirname}/public`))

// Is starts the server
app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
})
