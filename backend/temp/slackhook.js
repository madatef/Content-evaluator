
import express from 'express';
import cors from 'cors';



const app = express();
app.use(express.json());
const port = 6000;

app.use(cors());

const listen = (req, res) => {
    const { type, challenge, event } = req.body;
    console.log(req.body);

    // URL verification challenge
    if (type === 'url_verification') {
      return res.send({ challenge });
    }
  
    // Message event handler
    if (type === 'event_callback') {
      if (event.type === 'message' && !event.bot_id) {
        console.log(`New message from ${event.user}: ${event.text} \n\n\n\n\n\n`);
      }
    }
  
    res.status(200).end();
  }

app.listen(port, () => {
    console.log(`Eval server running on port ${port}`);
  });


app.post("/slackhook", listen);
