import server from "bunrest"
import { User } from "../models/User.model"
import { AuthGuard, UserRequest } from "../middleware/auth.guard"

const router = server().router()

require("dotenv")

router.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password } = req.body as {
      name: string
      surname: string
      email: string
      password: string
    }

    // create new user
    let newUser = new User(name, surname, email, password)

    // hash password
    await newUser.hashPassword()

    // save user
    newUser.save()

    // generate a token
    let token = newUser.generateToken()

    // return token
    return res.status(200).json({ token })
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string }

    // login user
    let token = await User.login(email, password)

    // return token
    return res.status(200).json({ token })
  } catch (err) {
    return res.status(500).send(err)
  }
})

router.get("/user", AuthGuard, (req: UserRequest, res) => {
  try {
    let user = req.user as { id: string }
    // find user by Id
    user = User.findOne({ id: user.id }) as User
    // return user
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).send(err)
  }
})

export default router
