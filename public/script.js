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
  }

  function fetchStories(){
    console.log('fetching stories')

    // populate my stories
  }
  
  var images = ['image1.jpg', 'image2.jpg', 'image3.jpg']; // Add more image URLs as needed
  var currentIndex = 0;
  
  function previousImage() {
    if (currentIndex > 0) {
      currentIndex--;
      document.querySelector('.image-wrapper img').src = images[currentIndex];
    }
  }
  
  function nextImage() {
    if (currentIndex < images.length - 1) {
      currentIndex++;
      document.querySelector('.image-wrapper img').src = images[currentIndex];
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