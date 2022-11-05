import express from "express";
import { google } from "googleapis";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { createUser } from "../services/user.services";

const router = express.Router();

function createConnection() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
}

const defaultScope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive.file",
];

function urlGoogle() {
  const auth = createConnection();
  const url = auth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope,
  });
  return url;
}

router.get("/login", (req, res, next) => {
  const url = urlGoogle();
  res.status(200).json({ status: "PASS", url: `${url}` });
});

router.get("/call_back", async (req, res, next) => {
  try {
    const auth = createConnection();
    const code = req.query.code as string;
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);

    const decoded = jwt.decode(tokens.id_token as string, {
      complete: true,
    }) as JwtPayload;

    const { name, email } = decoded.payload;
    await createUser(email, name);

    res.redirect(`scorder://open/tokens=${JSON.stringify(tokens)}`);

    res.json({
      status: "PASS",
    })

  } catch (e) {
    console.log("⚡️[server]: exception occured in call_back :: ", e);
  }
});

router.post("/authenticated", isAuthenticated, (req, res, next) => {
  res.status(200).json({
    status: "PASS",
  });
});

export default router;
