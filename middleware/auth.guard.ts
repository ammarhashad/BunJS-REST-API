import jwt from "jsonwebtoken"
import { BunRequest } from "bunrest/src/server/request"
import { BunResponse } from "bunrest/src/server/response"

export const AuthGuard = (
  req: UserRequest,
  res: BunResponse,
  next: ((err?: Error) => {}) | undefined
) => {
  const headers = req.headers

  let token = headers?.authorization

  if (!token) {
    return res.status(401).json({ msg: "No token , authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JwtSecret as string) as {
      id: string
    }

    req.user = decoded
    console.log(req.user)
    next!()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

export type UserRequest = BunRequest & {
  user?: { id: string }
}
