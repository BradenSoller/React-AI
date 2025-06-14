// import express from 'express';
// import * as dotenv from 'dotenv';
// import cors from 'cors';   
// import { Configuration, OpenAIApi } from 'openai';


// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });   
// const openai = new OpenAIApi(configuration);   
// const app = express(); 
// app.use(cors());
// app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello from DALL-E!');
// });

// app.post('/api/v1/dalle', async (req, res) => {
//     try {
//         const { prompt } = req.body.prompt;
  
//         const response = await openai.createCompletion({
//             model: 'text-davinci-003',
//             prompt: `${prompt}`,
//             temperature: 0,
//             max_tokens: 100,
//             top_p: 1,
//             frequency_penalty: 0.5,
//             presence_penalty: 0,
//         });
//         console.log(response.data);
//         res.status(200).send({
//             bot: response.data.choices[0].text
//         })
//     }
//     catch (error) {
//         console.error(error);
//         res.status(500).send('Something went wrong');
//     }
// });

// app.listen(5000, () => {
//     console.log('Server is running on port http://localhost:5174');
// }
// );
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from DALL·E!');
});

app.post('/api/v1/dalle', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    console.log(response.choices[0].message.content);
    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});
app.listen(5174, () => {
  console.log('Server is running on port http://localhost:5174');
});
