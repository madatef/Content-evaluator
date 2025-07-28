import express from 'express';
import cors from 'cors';
import { judgeRouter} from './judge.js'



const app = express();
app.use(express.json());

app.use(cors());

app.listen(5000, () => {
    console.log(`Eval server running on port 5000`);
  });


app.use("/evaluate", judgeRouter)

