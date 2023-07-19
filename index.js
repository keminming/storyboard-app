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
    if(req.params.index === '0'){
        res.status(200).json({text: "hello world"})
    }else{
        res.status(200).json({text: "hello world 1"})       
    }
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

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log(character)

    const fetch = require('node-fetch');

    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = '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';

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "system", "content": "I'\''m going to illustrate a book on Harry Potter. Tell me what to draw assuming I have no prior knowledge in 5 sentences with each sentence describing one element from the book."}, {"role": "user", "content": "Hello!"}]
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response
        // console.log(result);
        // Print out the query result
        console.log(result.choices[0].message.content);
        // Parse the comments into an array
        // Split the text into an array of lines using "\n" delimiter
        const text = result.choices[0].message.content;
        const lines = text.split("\n");

        // Filter out the number and trim each line to get the sentences
        const sentences = lines.map(line => line.replace(/^\d+\.\s*/, "").trim());

        // Remove empty or whitespace-only sentences from the array
        const filteredSentences = sentences.filter(sentence => sentence !== "");

        // Output the parsed sentences
        console.log([...sentences.entries()])
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
      

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
