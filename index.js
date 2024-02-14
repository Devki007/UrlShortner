const express=require("express")
const app=express();
const URL = require("./models/url");
const { connectTOMongoDB}=require('./mongoose.js')
const urlRouts=require('./ROUTES/url.js')
const PORT=8001;

connectTOMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log('mongodb connected'))

app.use(express.json());

app.use("/url", urlRouts);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visithistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT,()=>console.log(`server started at port${PORT}`))
