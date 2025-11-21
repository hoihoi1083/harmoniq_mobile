// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.API_KEY
});


export default async function main() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: system_prompt }, { role: "user", content: user_prompt }],
        model: "deepseek-chat",
        response_format: {
            'type': 'json_object'
        }
    });}

main();