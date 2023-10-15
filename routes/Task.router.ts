import server from "bunrest"
import { AuthGuard, UserRequest } from "../middleware/auth.guard"
import { Task } from "../models/Task.model"

const router = server().router()

require("dotenv")

router.post("/add-task", AuthGuard, async (req: UserRequest, res) => {
  try {
    // Extract values from body
    const { title, description } = req.body as {
      title: string
      description: string
    }
    // get logged in user id
    let user = req.user as { id: string }

    // create new task and save it
    let newTask = new Task(title, description, user.id)
    newTask.save()

    // return user's new task
    return res.status(200).json(newTask)
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.get("/my-tasks", AuthGuard, (req: UserRequest, res) => {
  try {
    // get logged in user id
    const user = req.user as { id: string }

    //  find all user's tasks
    let tasks = Task.findAllByUser({ id: user.id })

    // return user's tasks
    return res.status(200).json(tasks)
  } catch (err) {
    return res.status(500).send(err)
  }
})



export default router
