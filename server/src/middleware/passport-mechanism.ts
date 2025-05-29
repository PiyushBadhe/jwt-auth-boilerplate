import express from "express";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import postgres from "../../config/database";

const jwtSecret = process.env.JWT_SECRET as string;

export default class PassportMechanism {
  public static initialize(app: express.Express): void {
    this.configureStrategy();
    app.use(passport.initialize());
  }

  private static configureStrategy(): void {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    };

    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
          const result = await postgres.query(
            "SELECT id, username FROM users WHERE id = $1",
            [jwt_payload.id]
          );

          if (result.rows.length > 0) {
            return done(null, result.rows[0]);
          } else {
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      })
    );
  }
}
