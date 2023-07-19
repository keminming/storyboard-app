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

// Generate image using a text prompt, and save it within the directoryPath. The file path name should include the index
// which represents the ordering of the image in the storyboard
async function generateImage(text, index, directoryPath) {
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

      // Create the full path of the text by concatenating the directory path with the index
      const path = directoryPath + `/img_${index}.png`;
      console.log(path)
      // Write the file to the FS
      responseJSON.artifacts.forEach((image, num) => {
        fs.writeFileSync(
          path,
          Buffer.from(image.base64, 'base64')
        );
      });
    })();
}

// Get story in text from openAI using the text as a prompt
// The directooryPath is where to save the files that are later generated
async function getTextStory(text, directoryPath) {
    const axios = require('axios');
    const fs = require('fs');

    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    // Will take out the api key
    const apiKey = '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';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        "model": "gpt-3.5-turbo",
        "temperature": 0.1,
        'messages': [
          {'role': 'system', 'content': 'I am going to draw an illustrated book of the origins story of ' + text + '. Tell me what to draw assuming I have no prior knowledge in 5 sentences with each sentence describing one element from the book. Omit the word young.'},
        ]
    };
    try {
      // Make the request
        const response = await axios.post(apiEndpoint, data, { headers });
        console.log(response.data.choices[0].message.content);
        const text = response.data.choices[0].message.content;

        // Parse the comments into an array based on numbering - sometimes the output is in a numbered list
        filteredSentences = text.split(/\d+\.\s+/).filter(sentence => sentence.trim() !== "");

        // If the output is not a numbered list, there will only be one element in the array that we still need to parse
        // because it will still be a whole paragraph. Parse based periods, etc.
        if(filteredSentences.length == 1) {
          const paragraph = filteredSentences[0];
          filteredSentences = paragraph.split(/[.!?]+/).filter(sentence => sentence.trim() !== "");
        }

        // Output the parsed sentences with its index and value
        for (let i = 0; i < filteredSentences.length; i++) {
          console.log(`Index: ${i}, Value: ${filteredSentences[i]}`);
          // Generate an image for this sentence
          // Pass in index to maintain ordering within the storyboard
          textPath = directoryPath+`/txt_${i}.txt`;
          fs.writeFileSync(
            textPath,
            filteredSentences[i]
          );
          generateImage(filteredSentences[i], i, directoryPath);
        }
    } catch (error) {
        console.error(error);
    }
}

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log("The input is " + character)
    const fs = require('fs');

    // Create directory path to store the images
    const directoryPath = './public/creations/' + character;

    // Create the directory
    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        console.error('Error creating directory:', error);
      } else {
        console.log('Directory created successfully.');
      }
    });

  // call gpt api to get title and scripts
  // Then call stability ai api to get images
    getTextStory(character, directoryPath);

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
