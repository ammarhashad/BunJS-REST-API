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

router.get("/:id", AuthGuard, (req: UserRequest, res) => {
  try {
    console.log(req)
    // get logged in user's id
    const user = req.user as { id: string }

    // Extract Task ID from params and find it
    const task = Task.findById(req.params?.id as string)

    // if task doesnt belong to user throw error
    if (task?.user !== user.id) {
      throw new Error("User is not authorized.")
    }

    // return task
    return res.status(200).json({ task })
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
