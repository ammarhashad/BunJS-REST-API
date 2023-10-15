import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

export class User {
  id: string
  name: string
  surname: string
  email: string
  password: string

  static users: User[] = []

  constructor(name: string, surname: string, email: string, password: string) {
    const existingUser = User.findOne({ email })
    if (existingUser) {
      throw new Error("User with this email already exists.")
    }
    if (!name) {
      throw new Error("Name is required.")
    }
    if (!surname) {
      throw new Error("Surname is required.")
    }
    if (!email) {
      throw new Error("Email is required.")
    }
    if (!password) {
      throw new Error("Password is required.")
    }
    this.id = uuidv4()
    this.name = name
    this.surname = surname
    this.email = email
    this.password = password
  }

  // Method to asynchronously hash the user's password using
  async hashPassword(): Promise<void> {
    const hashedPassword = await Bun.password.hash(this.password)
    this.password = hashedPassword
  }

  // Method to save the user object to the static users array
  save(): void {
    User.users.push(this)
  }

  // Method to generate a JWT token for the user
  generateToken(): string {
    const token = jwt.sign({ id: this.id }, process.env.JwtSecret as string)
    return token
  }

  // Static method to log in a user by email and password
  static async login(email: string, password: string): Promise<string> {
    const user = this.findOne({ email })
    if (!user) {
      throw new Error("User not found")
    }

    const isMatch = await Bun.password.verify(password, user.password)

    if (!isMatch) {
      throw new Error("Incorrect password")
    }
    return user.generateToken()
  }

  // Static method to find a user based on a single key-value pair of attributes
  static findOne(query: { [key: string]: any }): User | null {
    const key = Object.keys(query)[0]
    const value = query[key]

    return this.users.find((user) => user[key as keyof User] === value) || null
  }
}

export type UserDocument = {
  id: string
  name: string
  surname: string
  email: string
  password: string
}
