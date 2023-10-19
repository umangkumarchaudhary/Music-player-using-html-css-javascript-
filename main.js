let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [
  {
    name: "Ram Siya Ram",
    artist: "Sachet Tandon",
    image: "https://pagalworld.com.pe/siteuploads/thumb/sft134/66697_4.jpg",
    path: "Music/Ram Siya Ram Siya Ram - Bhajan ! Hindi.mp3"  },
  {
    name: "Raataan Lambiyan",
    artist: "Arijit Singh",
    image: "images/download2.jpg",
    path: "Music/song 4.mp3"  },
  {
    name: "Tere sang yaara",
    artist: "Tours",
    image: "images/download3.jpg",
    path: "Music/Tere Sang Yaara - Rustom Ringtone  Girls Ringtone  Best Ringtone Yeah Beats.mp3"
  },
  {
    name: "Shipping Lanes",
    artist: "Chad Crouch",
    image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
    path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
  },
];

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

function loadPlaylist() {
  const playlistSelector = document.getElementById("playlist-selector");
  const selectedPlaylist = playlistSelector.value;

  if (selectedPlaylist === "default") {
    track_list = defaultPlaylist; // Assuming you have a default playlist defined
  } else if (selectedPlaylist === "custom") {
    // Load a custom playlist or fetch it from an external source
    // Example custom playlist:
    const customPlaylist = [
      {
        name: "Custom Track 1",
        artist: "Custom Artist 1",
        image: "images/apna_bana_le.jpg",
        path: "Music/song 1.mp3",
      },
      {
        name: "Custom Track 2",
        artist: "Custom Artist 2",
        image: "images/one_love.jpg",
        path: "Music/song 2.mp3",
      },
      {
        name: "Custom Track 3",
        artist: "Custom Artist 3",
        image: "images/one_love.jpg",
        path: "Music/Tere Te - Ap Dhillon ! Gurinder Gill ! Punjabi Song.mp3",
      },
      // Add more tracks as needed
    ];
    track_list = customPlaylist;
  }

  // Load the first track from the selected playlist
  track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function addTrackToCustomPlaylist() {
  const trackName = "New Track Name";
  const artistName = "New Artist Name";
  const imagePath = "images/download.jpg";
  const audioPath = "Music/song 2.mp3";

  // Create a new track object
  const newTrack = {
    name: trackName,
    artist: artistName,
    image: imagePath,
    path: audioPath,
  };

  // Add the new track to the custom playlist
  customPlaylist.push(newTrack);

  // Optionally, update the dropdown menu with the custom playlist
  const playlistSelector = document.getElementById("playlist-selector");
  const customOption = document.querySelector('option[value="custom"]');
  customOption.textContent = "Custom Playlist (" + customPlaylist.length + " tracks)";

  // Optionally, update the track_list with the custom playlist if it's currently selected
  if (playlistSelector.value === "custom") {
    track_list = customPlaylist;
    track_index = customPlaylist.length - 1; // Load the newly added track
    loadTrack(track_index);
    playTrack();
  }
}


let queueList = document.getElementById('queue-list');

// Function to add a song to the queue
// Function to add a song to the queue
function addToQueue(track) {
  let queueItem = document.createElement('li');
  queueItem.textContent = track.name + ' - ' + track.artist;
  queueList.appendChild(queueItem);
}

// Function to load and play the next song from the queue
function playNextFromQueue() {
  if (track_index < track_list.length - 1) {
    track_index++;
    loadTrack(track_index);
    playTrack();
  }
  // You can remove this line to keep all songs in the queue
   queueList.removeChild(queueList.firstChild);
}

// Function to load and play a specific song by index
function playSongByIndex(index) {
  loadTrack(index);
  playTrack();
}

// Function to add a song to the queue and make it clickable
function addToQueueAndMakeClickable(track, index) {
  let queueItem = document.createElement('li');
  queueItem.textContent = track.name + ' - ' + track.artist;
  queueList.appendChild(queueItem);

  // Add a click event listener to play the clicked song
  queueItem.addEventListener('click', function () {
    playSongByIndex(index);
  });
}

// Modify the nextTrack function to add songs to the queue
function nextTrack() {
  if (track_index < track_list.length - 1) {
    addToQueueAndMakeClickable(track_list[track_index + 1], track_index + 1);
  }
  if (track_index === track_list.length - 1) {
    // If it's the last track, loop back to the first track
    track_index = 0;
  } else {
    playNextFromQueue();
  }
}

// Initialize the queue with clickable items
function initializeQueue() {
  // Clear the queue list before initializing
  queueList.innerHTML = '';
  
  for (let i = track_index; i < track_list.length; i++) {
    addToQueueAndMakeClickable(track_list[i], i);
  }
}

// Load the first track in the tracklist and initialize the queue
loadTrack(track_index);
initializeQueue();
playTrack();
