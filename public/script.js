async function generateStory() {
  let character = document.getElementById("character").value;
  console.log(character);
  let resp = await fetch("/generate", {
    method : 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({character: character})
  });

  if(resp.status === 200){
    window.location.href = `/story.html?name=${character}`;
  }
}

async function populateStories(){
  console.log('fetching stories')

  let resp = await fetch("/stories", {
    method : 'GET',
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data = await resp.json();
  let stories = data.stories;

  // populate my stories
  let storyContainer = document.querySelector('#stories');

  // Loop through the array
  stories.forEach(item => {

    // create a story item
    let story = `<div class="thumbnails">
      <div class="thumbnail">
        <img src="creations/${item.title}/0/response.png" alt="${item.title}" width="100" height="100">
        <a href="/story.html?name=${item.title}">
          <h5>${item.title}</h5>
        </a>
      </div>
    </div>`;

    // append it to story container
    storyContainer.innerHTML += story;
  });
}

const scripts = new Array(5);

let currentIndex = 0;

function getStoryName(){
  const queryString = window.location.search;

  // Create a new URLSearchParams object with the query string
  const params = new URLSearchParams(queryString);

  // get story name param
  return params.get('name');
}

function populateImage(name, index){
  document.querySelector('#image-holder img').src = `creations/${name}/${index}/response.png`;
}

async function populateScript(name, index){
  if(scripts[index] === undefined){
    let resp = await fetch(`/story/${name}/board/${index}/text`, {
      method : 'GET',
    });

    let data = await resp.json();
    let script = data.text;
    scripts[index] = script;
  }
  document.querySelector('#scirpt-holder p').textContent = scripts[index];
}
  
function previousBoard() {
  const name = getStoryName();
  if (currentIndex > 0) {
    currentIndex--;
    populateImage(name, currentIndex);
    populateScript(name, currentIndex);
  }
}
  
function nextBoard() {
  const name = getStoryName();
  if (currentIndex < 4) {
    currentIndex++;
    populateImage(name, currentIndex);
    populateScript(name, currentIndex);
  }
}
  
async function saveStory() {
  let name = 'random'
  let resp = await fetch(`/save?name=${name}`, {
    method : 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({name: name})
  });

  let data = resp.json();

  // hide save button, show 'saved text'
}

function goHome() {
  window.location.href = 'index.html'; // Replace 'index.html' with the path to your home page
}