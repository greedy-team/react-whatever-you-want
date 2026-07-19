import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/missing-persons", async (req, res) => {
  const { rowSize, sexdstnDscd, age, page = "1" } = req.query;

  const body = new URLSearchParams();
  body.append("esntlId", process.env.SAFE182_ESNTL_ID);
  body.append("authKey", process.env.SAFE182_AUTH_KEY);
  body.append("rowSize", rowSize);
  body.append("page", page);
  

  if (sexdstnDscd) body.append("sexdstnDscd", sexdstnDscd);

  try {
    const response = await fetch(
      "https://www.safe182.go.kr/api/lcm/findChildList.do",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );
    const data = await response.json();
    if (data.result === "00") {
      const rawCount = data.list.length;


      if (age && age !== "none") {
        const start = Number(age);
        const end = age === "80" ? 999 : start + 9;

        data.list = data.list.filter((person) => {
          const currentAge = Number(person.ageNow);
          return currentAge >= start && currentAge <= end;
        });
      }
      data.hasMore = rawCount === Number(rowSize);
      data.totalCount = data.list.length;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 가져오지 못했습니다" });
  }
});

app.listen(4000, () => {
  console.log("서버 실행중: http://localhost:4000");
});
