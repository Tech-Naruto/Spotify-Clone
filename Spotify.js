let podcast_songs = document.querySelectorAll(".podcast-songs, .top-songs");
let media_player = document.querySelector(".media-player");
let media_player_img = media_player.querySelector(".img");
let song_playing_details = media_player.querySelector(".song-playing");

let song_playing = null;
let interval_id = null;

//Adding buttons when hover on songs
podcast_songs.forEach((song) => {
  song.style.transition = "box-shadow 0.2s ease";

  let img = song.querySelector(".img");

  song.addEventListener("mouseenter", () => {
    song.style.backgroundColor = "#292828";
    song.style.transition = "background-color 0.2s ease, box-shadow 0.2s ease";
    let pause_btn = img.querySelector(".fa-pause");
    let play_btn = img.querySelector(".fa-play");
    if (!pause_btn && !play_btn) {
      let play_btn = document.createElement("icon");
      play_btn.setAttribute(
        "style",
        "background-color:rgb(77, 208, 77); height : 2.8rem; width: 2.8rem; display:flex; transition: opacity 0.2s ease ,transform 0.2s ease, background-color 0.2s ease; transform:scale(0); opacity: 0; justify-content:center; align-items:center; border-radius:50%; color: black; margin-right: 5px; margin-bottom: 5px; cursor: pointer"
      );
      play_btn.className = "fa-solid fa-play";

      img.appendChild(play_btn);
      setTimeout(() => {
        play_btn.style.opacity = "1";
        play_btn.style.transform = "scale(1)";
        play_btn.addEventListener("mouseover", () => {
          play_btn.style.transform = "scale(1.1)";
          play_btn.style.backgroundColor = "rgb(110, 222, 110)";
        });
        play_btn.addEventListener("mouseout", () => {
          if (play_btn.className == "fa-solid fa-play") {
            play_btn.style.transform = "scale(1)";
            play_btn.style.backgroundColor = "rgb(77, 208, 77)";
          }
        });
        play_btn.addEventListener("click", () => {
          if (play_btn.className == "fa-solid fa-play") {
            if (song_playing && song_playing != song) {
              let img = song_playing.querySelector(".img");
              let pause_btn = img.querySelector(".fa-solid");
              song_playing.style.boxShadow = "none";
              song_playing.style.backgroundColor = "transparent";
              remove_btn(pause_btn, img);
              stop_playing();
              play_time.forEach((play_time) => {
                play_time.value = 0;
                play_time.dispatchEvent(new Event("input"));
              });
            }
            play_btn.className = "fa-solid fa-pause";
            if (media_control_buttons.querySelector(".fa-play")) {
              media_control_buttons.querySelector(".fa-play").className =
                "fa-solid fa-pause media-play-pause-button";
            }
            //For mobile play-pause button
            if (music_tools.querySelector(".fa-play")) {
              music_tools.querySelector(".fa-play").className =
                "fa-solid fa-pause media-play-pause-button";
            }
            if (!song_playing) {
              play_time.forEach((play_time) => {
                play_time.value = 0;
                play_time.dispatchEvent(new Event("input"));
              });
            }
            song_playing = song;
            song.style.boxShadow = "0px 0px 10px rgb(122, 224, 122)";
            media_player_img.style.backgroundImage = img.style.backgroundImage;
            media_player_img.style.backgroundSize = "cover";
            media_player_img.style.backgroundPosition = "center";
            song_playing_details
              .querySelector(".details")
              .querySelector(".song").innerText = song
              .querySelector(".img-detail")
              .querySelector(".song").innerText;
            song_playing_details
              .querySelector(".details")
              .querySelector(".song-detail").innerText = song
              .querySelector(".img-detail")
              .querySelector(".song-detail").innerText;
            start_playing(play_time);
          } else {
            play_btn.className = "fa-solid fa-play";
            media_control_buttons.querySelector(".fa-pause").className =
              "fa-solid fa-play media-play-pause-button";
            //For mobile play-pause button
            music_tools.querySelector(".fa-pause").className =
              "fa-solid fa-play media-play-pause-button";
            stop_playing();
          }
        });

        if (!song_playing) {
          play_btn.addEventListener(
            "click",
            () => {
              media_player.style.display = "";
              setTimeout(() => {
                media_player.style.opacity = "1";
                media_player.style.bottom = "0";
              }, 50);

              if (isMobile()) {
                console.log("Mobile browser");
                document.querySelector(".main-body").style.marginBottom =
                  "10rem"; // Applies only on mobile
              } else {
                console.log("Laptop/desktop browser");
                document.querySelector(".main-body").style.marginBottom =
                  "5rem"; // Applies only on desktop
              }
            },
            { once: true }
          );
        }
      }, 50);
    }
  });
  song.addEventListener("mouseleave", () => {
    if (song_playing != song) {
      song.style.backgroundColor = "transparent";
      let play_btn = img.querySelector(".fa-play");
      remove_btn(play_btn, img);
    }
  });

  function remove_btn(btn, img) {
    btn.style.opacity = "0";
    btn.style.transform = "scale(0)";
    setTimeout(() => {
      img.removeChild(btn);
    }, 100);
  }
});

//Play-Pause button in media control
let music_tools = document.querySelector(".music-tools"); // For mobile play-pause button
let media_control_buttons = media_player.querySelector(".control-buttons");
let media_play_pause_button = document.querySelectorAll(
  ".media-play-pause-button"
);
media_play_pause_button.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.className == "fa-solid fa-pause media-play-pause-button") {
      button.className = "fa-solid fa-play media-play-pause-button";
      let play_btn = song_playing
        .querySelector(".img")
        .querySelector(".fa-pause");
      play_btn.className = "fa-solid fa-play";
      stop_playing();
    } else if (song_playing) {
      button.className = "fa-solid fa-pause media-play-pause-button";
      let play_btn = song_playing
        .querySelector(".img")
        .querySelector(".fa-play");
      play_btn.className = "fa-solid fa-pause";
      start_playing(play_time);
    }
  });
});

function start_playing(play_time) {
  interval_id = setInterval(() => {
    if (play_time[0].value == play_time[0].max) {
      console.log("song completed");
      stop_playing();
      setTimeout(() => {
        forward_step.dispatchEvent(new Event("click"));
      }, 100);
    }
    play_time.forEach((play_time) => {
      play_time.value = Number(play_time.value) + 1;
      play_time.dispatchEvent(new Event("input"));
    });
    console.log(play_time[0].value);
  }, 1000);
}

function stop_playing() {
  clearInterval(interval_id);
  console.log("stop playing");
  interval_id = null;
}

//Progress bar in media control
let play_bar = document.querySelectorAll(".play-bar");
let play_time = document.querySelectorAll("#play-time");
let current_play_time = document.querySelector(".current-play-time");
let total_play_time = document.querySelector(".total-play-time");
let root_font = parseFloat(getComputedStyle(document.documentElement).fontSize);

play_time[0].addEventListener("input", () => {
  console.log("input triggered");
  let input_value = play_time[0].value;
  let curr_time_min = Math.floor(input_value / 60);
  let curr_time_sec = input_value % 60;
  let curr_time = `${curr_time_min}:`;
  if (curr_time_sec < 10) {
    curr_time += "0" + curr_time_sec;
  } else {
    curr_time += curr_time_sec;
  }
  current_play_time.innerText = curr_time;

  play_time.forEach((play_time) => {
    let progress_bar_fill = play_time.previousElementSibling;
    let total_width = play_time.offsetWidth - Math.floor(0.5 * root_font);
    let fill_width =
      Math.floor(0.2 * root_font) +
      Math.floor((total_width / Number(play_time.max)) * Number(input_value));
    progress_bar_fill.style.width = `${fill_width}px`;
  });
});

// Volume bar in media control
let volume_bar = document.querySelector(".volume-bar");
let volume = document.querySelector("#volume");

volume.addEventListener("input", () => {
  let input_value = volume.value;
  let progress_bar_fill = volume_bar.querySelector(".progress-bar-fill");
  let total_width = volume.offsetWidth - Math.floor(0.5 * root_font);
  let fill_width =
    Math.floor(0.4 * root_font) +
    Math.floor((total_width / 100) * Number(input_value));
  progress_bar_fill.style.width = `${fill_width}px`;
});

//Next and previous song buttons in media control
let forward_step = media_control_buttons.querySelector(".fa-forward-step");
let backward_step = media_control_buttons.querySelector(".fa-backward-step");

forward_step.addEventListener("click", () => {
  if (song_playing) {
    swipe_animation(-100);
  }
});

backward_step.addEventListener("click", () => {
  if (song_playing) {
    swipe_animation(100);
  }
});

function next_song(song_playing, num) {
  let song_index = Array.from(podcast_songs).indexOf(song_playing);
  podcast_songs[song_index].dispatchEvent(new Event("mouseleave"));
  if (song_index == podcast_songs.length - 1 && num == 1) {
    song_index = -1;
  }
  if (song_index == 0 && num == -1) {
    song_index = podcast_songs.length;
  }
  podcast_songs[song_index + num].dispatchEvent(new Event("mouseenter"));
  setTimeout(() => {
    podcast_songs[song_index + num]
      .querySelector(".img")
      .querySelector(".fa-play")
      .dispatchEvent(new Event("click"));
  }, 50);
  play_time.forEach((play_time) => {
    play_time.value = 0;
    play_time.dispatchEvent(new Event("input"));
  });
}

//Detecting mobile browser
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

//Swipe effect on media player
let startX = 0;
media_player.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX; // Stores the starting touch position
});
media_player.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX; // Stores the ending touch position

  let threshold = window.innerWidth * 0.15; // Adjust the threshold as needed

  if (startX - endX > threshold) {
    console.log("swipe left");
    swipe_animation(-100);
  } else if (endX - startX > threshold) {
    console.log("swipe right");
    swipe_animation(100);
  }
});

function swipe_animation(x) {
  let details = song_playing_details.querySelectorAll(".song, .song-detail");
  details.forEach((details) => {
    details.style.transform = `translateX(${x}%)`;
    details.style.opacity = "0";
    details.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    media_player_img.style.transform = "scale(0)";
    media_player_img.style.transition = "transform 0.3s ease";
  });
  setTimeout(() => {
    details.forEach((details) => {
      details.style.transition = "transform 0s ease, opacity 0.5s ease";
      details.style.transform = `translateX(${-x}%)`;
    });
  }, 350);
  setTimeout(() => {
    next_song(song_playing, x > 0 ? -1 : 1);
    details.forEach((details) => {
      details.style.transition = "transform 0.3s ease, opacity 0.5s ease";
      details.style.opacity = "1";
      details.style.transform = "translateX(0%)"; 
      media_player_img.style.transform = "scale(1)";
    });
  }, 400);
}
