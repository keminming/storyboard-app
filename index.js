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

async function chatWithAI() {
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
          {'role': 'system', 'content': 'I am going to draw an illustrated book of the Harry Potter story. Please tell me what to draw as if I did not know anything about harry Potter. Do not add numbers to the sentences.'},
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

        // Remove empty or whitespace-only sentences from the array
        const filteredSentences = sentences.filter(sentence => sentence !== "");

        // Output the parsed sentences
        filteredSentences.forEach(sentence => console.log(sentence));
    } catch (error) {
        console.error(error);
    }
}

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log(character)
    chatWithAI();

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
