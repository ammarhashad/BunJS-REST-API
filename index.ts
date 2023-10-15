import server from "bunrest"
import UserRouter from "./routes/User.router"
import TaskRouter from "./routes/Task.router"
require("dotenv")

const app = server()

app.use("/users", UserRouter)
app.use("/task", TaskRouter)

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
