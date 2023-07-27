const audios = document.querySelectorAll("audio");

function initProgressBar(audio) {
	let progressbar = document.getElementById("player-progress");
	progressbar.value = audio.currentTime / audio.duration;
}

for (const audio of audios) {
	audio.addEventListener("timeupdate", () => {
		initProgressBar(audio);
		if (audio.currentTime === audio.duration) {
			if (audio === audios[audios.length - 1]) {
				audio.pause();
				audio.nextElementSibling.innerHTML = "";
				document.querySelector("#player-play").innerHTML = "play_arrow";
			} else {
				skipNext(audio.parentElement.parentElement);
			}
		}
	});
}

function updatePlayerDetails(songTitle) {
	const currentSong = songs.find((song) => song.title === songTitle);

	if (currentSong) {
		const image = document.querySelector("#player-image");
		image.src = currentSong.artist.image;
		document.querySelector("#player-controls").removeAttribute("hidden");
		document.querySelector("progress").removeAttribute("hidden");
		document.querySelector("#player-song").innerHTML = currentSong.title;
		document.querySelector("#player-artist").innerHTML =
			currentSong.artist.name;
		document.querySelector("#player-lang").innerHTML = currentSong.language;
	}
}

function togglePlay(audio) {
	if (audio.paused) {
		if (!audio.src) {
			audio.src = audio.getAttribute("data-src");
		}

		audio.parentElement.parentElement.classList.add("active");
		audio.nextElementSibling.innerHTML = "equalizer";
		document.querySelector("#player-play").innerHTML = "pause";

		pauseOtherAudios(audio);

		const songTitle =
			audio.parentElement.parentElement.children[1].innerHTML;
		updatePlayerDetails(songTitle);
		audio.play();
	} else {
		audio.nextElementSibling.innerHTML = "";
		document.querySelector("#player-play").innerHTML = "play_arrow";

		audio.pause();
	}
}

function skipNext(currentTrack) {
	const nextTrack = currentTrack.parentElement.nextElementSibling.children[0];
	const nextAudio = nextTrack.querySelector("audio");
	if (nextTrack) {
		togglePlay(nextAudio);
	}
}

function skipPrev(currentTrack) {
	const prevTrack =
		currentTrack.parentElement.previousElementSibling.children[0];
	const prevAudio = prevTrack.querySelector("audio");
	if (prevTrack) {
		togglePlay(prevAudio);
	}
}

function pauseOtherAudios(currentAudio) {
	for (const audio of audios) {
		if (audio !== currentAudio) {
			const listItem = audio.closest(".oneAudio");
			listItem.classList.remove("active");
			audio.nextElementSibling.innerHTML = "";
			audio.pause();
			audio.currentTime = 0;
		}
	}
}
