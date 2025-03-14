const OpenAI  = require("openai");

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {"role": "user", "content": "你好"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));