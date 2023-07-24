var currentAudio;
var wavesurfers = [];

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);
  return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

function updateTimer(currentTime, duration) {
  var currentTimeFormatted = formatTime(currentTime);
  var durationFormatted = formatTime(duration);
  var timerElement = document.getElementById('timer');
  timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
}

function playAudio(index) {
  stopAudio(); // Stop currently playing audio, if any

  var wavesurfer = wavesurfers[index - 1];
  wavesurfer.on('finish', function() {
    // Automatically play the next audio after the current song ends
    var nextIndex = (index % wavesurfers.length) + 1;
    playAudio(nextIndex);
  });
  
  wavesurfer.on('audioprocess', function() {
    var currentTime = wavesurfer.getCurrentTime();
    var duration = wavesurfer.getDuration();
    updateTimer(currentTime, duration, index); // Pass the index to updateTimer
  });
  
  wavesurfer.play();
  currentAudio = wavesurfer;
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.stop();
    currentAudio.un('finish'); // Remove the 'finish' event listener
    currentAudio = null;
  }
}

function pauseAudio() {
  if (currentAudio) {
    currentAudio.pause();
  }
}

function resumeAudio() {
  if (currentAudio) {
    currentAudio.play();
  }
}

function nextAudio() {
  var currentIndex = wavesurfers.findIndex(function(wavesurfer) {
    return wavesurfer === currentAudio;
  });
  var nextIndex = (currentIndex + 1) % wavesurfers.length;
  playAudio(nextIndex + 1);
}

function previousAudio() {
  var currentIndex = wavesurfers.findIndex(function(wavesurfer) {
    return wavesurfer === currentAudio;
  });
  var previousIndex = (currentIndex - 1 + wavesurfers.length) % wavesurfers.length;
  playAudio(previousIndex + 1);
}

function updateTimer(currentTime, duration, index) {
  var currentTimeFormatted = formatTime(currentTime);
  var durationFormatted = formatTime(duration);
  var timerElement = document.getElementById('timer-' + index);
  timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
}

// Initialize wavesurfers
var waveContainers = document.querySelectorAll('[id^="waveform-"]');
waveContainers.forEach(function(container, index) {
  var wavesurfer = WaveSurfer.create({
    container: container,
    // backend: 'MediaElement', // Use HTML5 audio element as the backend
    waveColor: 'lightskyblue',
    progressColor: 'lightslategray',
    cursorColor: 'rgba(0,0,0,0)',
    height: 88
  });
  wavesurfers[index] = wavesurfer;
  wavesurfer.load(document.querySelector('#audio-' + (index + 1)).src);
  wavesurfer.on('ready', function() {
    if (index === 0) {
      wavesurfer.pause();
    }
  });
});