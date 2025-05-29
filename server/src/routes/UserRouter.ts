import bcrypt from "bcrypt";
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import postgres from "../../config/database";

class UserRouter {
  private router: Router;
  private saltRounds: number = Number(process.env.SALTS!);
  private jwtSecret = process.env.JWT_SECRET!;
  constructor() {
    this.router = express.Router();
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post("/register", async (req: Request, res: Response) => {
      const { username, password } = req.body;
      try {
        const hashed = await bcrypt.hash(password, this.saltRounds);
        await postgres.query(
          "INSERT INTO users (username, password) VALUES ($1, $2)",
          [username, hashed]
        );
        res.status(201).json({ message: `Welcome aboard ${username}` });
      } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Registration failed" });
      }
    });

    this.router.post("/login", async (req: Request, res: Response) => {
      const { username, password } = req.body;
      try {
        const result = await postgres.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        if (result.rows.length === 0) {
          res.status(401).json({ message: "User doesn't exist" });
          return;
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(401).json({ message: "Incorrect username or password" });
          return;
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          this.jwtSecret,
          { expiresIn: "2m" }
        );

        res.json({ token, user: { id: user.id, username: user.username } });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
      }
    });

    this.router.post("/logout", (req: Request, res: Response, next) => {
      req.logout((err) => {
        if (err) return next(err);
        res.send({ message: "Logged out" });
      });
    });

    this.router.get(
      "/profile",
      passport.authenticate("jwt", { session: false }),
      (req, res) => {
        res.json({ message: "Protected route accessed", user: req.user });
      }
    );
  }

  public getRoutes(): Router {
    return this.router;
  }
}

export default UserRouter;
