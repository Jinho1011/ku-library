import axios from "axios";
import express, { Request, Response } from "express";

const loginRouter = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
  const id = req.body.id;
  const pwd = req.body.pwd;

  const data = `{"loginId":"${id}","password":"${pwd}","isFamilyLogin":false,"isMobile":false}`;

  const config = {
    method: "post",
    url: "https://library.konkuk.ac.kr/pyxis-api/api/login",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: data,
  };

  const loginRes = await axios(config);
  const userData = await loginRes.data;
  const accessToken = userData.data.accessToken;

  res.cookie("accessToken", accessToken);
  res.send(userData);
});

export default loginRouter;
