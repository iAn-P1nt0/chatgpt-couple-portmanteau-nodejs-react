import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const celebrity1 = req.body.celebrity1 || '';
  const celebrity2 = req.body.celebrity2 || '';
  if (celebrity1.trim().length === 0 || celebrity2.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Celebrity 1 Name",
      }
    });
    return;
  }

  if (celebrity1 === celebrity2) {
    res.status(400).json({
      error: {
        message: "Both celebrities cannot be the same. Please enter different celebrity names",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(celebrity1, celebrity2),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(celebrity1, celebrity2) {
  const capitalizedCelebrity1 =
    celebrity1[0].toUpperCase() + celebrity1.slice(1).toLowerCase();
  const capitalizedCelebrity2 =
    celebrity2[0].toUpperCase() + celebrity2.slice(1).toLowerCase();
  return `Suggest portmanteau for ${capitalizedCelebrity1} and ${capitalizedCelebrity2}.

Celebrity1: Brad
Celebrity2: Angelina
Portmanteau: Brangelina
Celebrity1: Ben
Celebrity2: Jennifer
Portmanteau: Bennifer
Celebrity1: Virat
Celebrity2: Anushka
Portmanteau: Virushka
Celebrity1: ${capitalizedCelebrity1}
Celebrity2: ${capitalizedCelebrity2}
Portmanteau:`;
}

