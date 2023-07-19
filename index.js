const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded())

// return the text for a particular story board
app.get('/story/:name/board/:index/text', (req, res) => {
    // get the story name from the query
    console.log(req.params.name)
    console.log(req.params.index)

    // search file system 
    res.status(200).json({text: "hello world"})
})

// return the image for a particular story board
app.get('/story/:name/board/:index/image', (req, res) => {
    // get the story name from the query
    console.log(req.params.name)
    console.log(req.params.index)

    // search file system and return the requested image
})

// return a list of stories (metadata) stored on the server
app.get('/stories', (req, res) => {

    let stories = [
        {title:"a", length:1},
        {title:"b", length:1}
    ]
    res.status(200).json({stories: stories})
})

/*
what's on disk?

/creations
    /story-1 
        --- topic txt
        --- /story-board 1
            --- prompt and params txt
            --- image png
        --- /story-board 2
            --- prompt and params txt
            --- image png
    /story-2
*/        

// async function generateImage(text) {
//   const stabilityApiKey = 'sk-7hCelYiEhiK4aHj12oAWQ65aOQXBJkK1CT3ld91HZoxp4aJx';
//   const stabilityEndpoint = 'https://api.stability.ai/v1/generate';

//   try {
//     const response = await axios.post(stabilityEndpoint, {
//       text: text,
//       apiKey: stabilityApiKey,
//     });

//     // Handle the response here
//     const imageUrl = response.data.url;
//     console.log('Generated image:', imageUrl);
//     // You can display or further process the image as needed
//   } catch (error) {
//     console.error('Error generating image:', error);
//   }
// }



async function generateImage(text, index) {
    const fetch = require('node-fetch');
    const fs = require('fs');

    const engineId = 'stable-diffusion-v1-5';
    const apiHost = process.env.API_HOST || 'https://api.stability.ai';
    const apiKey = 'sk-7hCelYiEhiK4aHj12oAWQ65aOQXBJkK1CT3ld91HZoxp4aJx';

    if (!apiKey) throw new Error('Missing Stability API key.');

    (async () => {
      const response = await fetch(
        `${apiHost}/v1/generation/${engineId}/text-to-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: text,
              },
            ],
            cfg_scale: 7,
            clip_guidance_preset: 'FAST_BLUE',
            height: 512,
            width: 512,
            samples: 1,
            steps: 30,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Non-200 response: ${await response.text()}`);
      }

      const responseJSON = await response.json();

      console.log(text)
      responseJSON.artifacts.forEach((image, num) => {
        fs.writeFileSync(
          `/Users/annewu/hackathon/v1_txt2img_${index}.png`,
          Buffer.from(image.base64, 'base64')
        );
      });
    })();
}

// Call the function with the desired text
// generateImage('This is the text to convert to an image.');

async function chatWithAI(text) {
  console.log(text)
    const axios = require('axios');
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    // Will take out the api key
    const apiKey = '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';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        "model": "gpt-3.5-turbo",
        'messages': [
          {'role': 'system', 'content': 'I am going to draw an illustrated book of the origins story of ' + text + '. Please tell me what to draw as if I do not have any prior knowledge. Do not add numbers to the sentences. Limit to 3 sentences. Omit the word young.'},
        ]
    };
    try {
        const response = await axios.post(apiEndpoint, data, { headers });
        //console.log(response.data.choices[0].message.content);
        // Parse the comments into an array
        // Split the text into an array of lines using "\n" delimiter
        const text = response.data.choices[0].message.content;
        const lines = text.split("\n");

        // Filter out the number and trim each line to get the sentences
        const sentences = lines.map(line => line.replace(/^\d+\.\s*/, "").trim());

        console.log(response.data.choices[0].message.content);
        // Remove empty or whitespace-only sentences from the array
        const filteredSentences = sentences.filter(sentence => sentence !== "");

        // Output the parsed sentences
       // const filteredSentences = ['A dog', 'a cat', 'a mouse'];
        //filteredSentences.forEach(sentence => generateImage(sentence, ));
        for (let i = 0; i < filteredSentences.length; i++) {
          console.log(`Index: ${i}, Value: ${filteredSentences[i]}`);
          generateImage(filteredSentences[i], i);
        }
    } catch (error) {
        console.error(error);
    }
}

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log(character)
    chatWithAI(character);

    // call gpt api to get title and scripts

    // call stability ai api to get images

    // save the image respond and other info to the disk folder

    // redirect to /story?name={foldername} page to show to story
})

// save to acp
app.post('/save', (req, res) => {
    // get the story name from the query
    console.log(req.query.name)

    // find the folder by using the foldername

    // create a dcx composite from the folder

    // push the composite to acp

    res.status(200).json({})
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
