const audioElems = document.querySelectorAll("audio");
audioElems.forEach((player) => wrapAudioElem(player));
const audioPlayers = document.querySelectorAll(".audio-player");
audioPlayers.forEach((player) => setupAudioPlayer(player));

function wrapAudioElem(audioElem) {
  let transcriptElem = audioElem.nextElementSibling;
  if (!transcriptElem || !transcriptElem.hasAttribute("data-transcript")) {
    transcriptElem = document.createElement("div");
  }
  const transcript = transcriptElem.innerHTML;
  const playerClone = audioElem.cloneNode(true);
  const template = document.getElementById("audio-player-template");
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".transcript").innerHTML = transcript;
  transcriptElem.innerHTML = "";

  node.prepend(playerClone);
  audioElem.replaceWith(node);
}

function setupAudioPlayer(player) {
  const audio = player.querySelector("audio");
  player.querySelector(".title").textContent =
    audio.getAttribute("data-title") || "";
  const progress = player.querySelector(".progress-slider");
  const currentTime = player.querySelector(".current-time");
  const durationTime = player.querySelector(".duration");
  const playPauseButton = player.querySelector(".play-pause-button");
  const playPauseButtonIcon = playPauseButton.querySelector(
    ".material-symbols-outlined"
  );
  const volumeSlider = player.querySelector(".volume-slider");
  const muteButton = player.querySelector(".mute-button");
  const muteButtonIcon = muteButton.querySelector(".material-symbols-outlined");

  // give the input slider gradients initial values
  volumeSlider.style.backgroundSize = volumeSlider.value * 100 + "% 100%";
  volumeSlider.classList.remove("hidden");
  progress.style.backgroundSize = "0% 100%";
  progress.classList.remove("hidden");

  const showHideTranscriptBtn = player.querySelector(".showHideTranscriptBtn");
  showHideTranscriptBtn.addEventListener("click", () => {
    const open = showHideTranscriptBtn.classList.contains("open");
    if (open) {
      showHideTranscriptBtn.classList.remove("open");
    } else {
      showHideTranscriptBtn.classList.add("open");
    }
  });

  // Play or pause audio on button click
  playPauseButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playPauseButtonIcon.textContent = "pause_circle";
    } else {
      audio.pause();
      playPauseButtonIcon.textContent = "play_circle";
    }
  });

  // Update progress bar and time displays
  audio.addEventListener("timeupdate", () => {
    if (audio.currentTime === audio.duration) {
      playPauseButtonIcon.textContent = "play_circle";
    }
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.value = progressPercent;

    // update bar
    progress.style.backgroundSize = progressPercent + "% 100%";

    // Update current time display
    const currentTimeMinutes = Math.floor(audio.currentTime / 60);
    const currentTimeSeconds = Math.floor(audio.currentTime % 60);
    currentTime.textContent = `${currentTimeMinutes
      .toString()
      .padStart(2, "0")}:${currentTimeSeconds.toString().padStart(2, "0")}`;

    // Update duration display
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);
    durationTime.textContent = `${durationMinutes
      .toString()
      .padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;
  });

  // Update volume on slider change
  volumeSlider.addEventListener("input", () => {
    volumeSlider.style.backgroundSize = volumeSlider.value * 100 + "% 100%";

    audio.volume = volumeSlider.value;
    // If the volume is set to 0, update the mute button text accordingly
    if (audio.volume === 0) {
      muteButtonIcon.textContent = "volume_up";
    } else {
      muteButtonIcon.textContent = "volume_off";
    }
  });

  // Seek audio when progress slider is changed
  progress.addEventListener("input", () => {
    const seekTime = (audio.duration / 100) * progress.value;
    audio.currentTime = seekTime;
  });

  // Mute or unmute audio on mute button click
  muteButton.addEventListener("click", () => {
    if (audio.muted) {
      audio.muted = false;
      muteButtonIcon.textContent = "volume_off";
      volumeSlider.value = audio.volume; // Set the volume slider value back to the original volume
    } else {
      audio.muted = true;
      muteButtonIcon.textContent = "volume_up";
      volumeSlider.value = 0; // Set the volume slider value to 0 when muted
    }
    volumeSlider.style.backgroundSize = volumeSlider.value * 100 + "% 100%";
  });
}
