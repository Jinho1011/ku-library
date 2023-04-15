import axios from "axios";
import express, { Request, Response } from "express";

const reserveRouter = express.Router();

const reserveIntervals: {
  seatNum: number;
  accessToken: any;
  startTime: Date;
}[] = [];

const macroIntervals: { seatNum: number; accessToken: any }[] = [];

reserveRouter.get("/:seatNum", async (req: Request, res: Response) => {
  const seatNum = req.params.seatNum;
  console.log(req.cookies);
  const accessToken = req.cookies.accessToken || "";

  const reserve = {
    seatNum: parseInt(seatNum) + 594,
    accessToken,
    startTime: new Date(),
  };

  reserveIntervals.push(reserve);

  const response = reserveSeat(parseInt(seatNum) + 594, accessToken);

  res.send(response);
});

reserveRouter.get("/macro/:seatNum", async (req: Request, res: Response) => {
  const seatNum = req.params.seatNum;
  const accessToken = req.cookies.accessToken || "";

  const reserve = {
    seatNum: parseInt(seatNum) + 594,
    accessToken,
  };

  macroIntervals.push(reserve);

  const response = reserveSeat(parseInt(seatNum) + 594, accessToken);

  res.send(response);
});

async function reserveSeat(seatNum: number, accessToken: string) {
  const data = `{"seatId":${seatNum},"smufMethodCode":"PC"}`;

  const config = {
    method: "post",
    url: "https://library.konkuk.ac.kr/pyxis-api/1/api/seat-charges",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "ko",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "application/json;charset=UTF-8",
      "Pyxis-Auth-Token": accessToken,
    },
    data: data,
  };

  const reserveRes = await axios(config);
  return await reserveRes.data;
}

function circulateReservationIntervals() {
  const now = new Date();
  reserveIntervals.forEach(function (seat) {
    const diff = now.valueOf() - seat.startTime.valueOf();
    if (diff >= 1 * 60 * 1000) {
      // 10분이 지난 경우
      reserveSeat(seat.seatNum, seat.accessToken);

      // 다음 예약을 위해 startTime 값 갱신
      const elapsedMinutes = Math.floor(diff / (1000 * 60)); // 경과된 분 계산
      seat.startTime = new Date(
        seat.startTime.getTime() + elapsedMinutes * 1 * 60 * 1000
      );
    }
  });
}

setInterval(circulateReservationIntervals, 1000); // 1초마다 checkSeats 함수 실행

const macroInterval = setInterval(() => {
  macroIntervals.forEach(async function (seat) {
    console.log(seat.seatNum, seat.accessToken);
    const r = await reserveSeat(seat.seatNum, seat.accessToken);
    console.log(new Date(), r);
    if (r.success) {
      clearInterval(macroInterval);
    }
  });
}, 1000);

export default reserveRouter;
