import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';   
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});   

const openai = new OpenAIApi(configuration);   
const app = express(); 
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello from DALL-E!');
});

app.post('/api/v1/dalle', async (req, res) => {
    try {
        const { prompt } = req.body.prompt;
  
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log(response.data);
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});
