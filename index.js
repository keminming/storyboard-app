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

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log(character)

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
