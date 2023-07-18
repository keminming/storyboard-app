const path = require('path')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.sendFile("public/index.html", {root: __dirname})
})

app.get('/story', (req, res) => {
    // get the story name from the query
    console.log(req.query.name)

    // search file system 

    res.sendFile("public/story.html", {root: __dirname})
})

app.post('/stories', (req, res) => {
    res.status(200).json({})
})

app.post('/generate', (req, res) => {
    const {character} = req.body;
    console.log(character)

    // call gpt api to get title and scripts

    // call stability ai api to get images

    // save the image respond and other info to the disk folder

    // redirect to /story?name={foldername} page to show to story
})

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
