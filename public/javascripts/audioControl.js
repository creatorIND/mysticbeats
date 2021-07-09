const audios = document.querySelectorAll("audio");

function pauseOtherAudios(a) {
	for (const audio of audios) {
		if (audio !== a) {
			audio.parentElement.parentElement.classList.remove("active");
			audio.nextElementSibling.innerHTML = "";
			audio.pause();
			audio.currentTime = 0;
			document.querySelector("#player-play").innerHTML = "play_arrow";
		}
	}
}

for (const audio of audios) {
	audio.addEventListener("play", () => {
		audio.parentElement.parentElement.classList.add("active");
		pauseOtherAudios(audio);
		audio.nextElementSibling.innerHTML = "equalizer";
		document.querySelector("#player-play").innerHTML = "pause";
		for (song of songs) {
			if (
				song.title ===
				audio.parentElement.parentElement.children[1].innerHTML
			) {
				document
					.querySelector("#player-controls")
					.removeAttribute("hidden");
				document.querySelector("progress").removeAttribute("hidden");
				const image = document.querySelector("#player-image");
				image.src = song.artist.image;
				document.querySelector("#player-song").innerHTML = song.title;
				document.querySelector("#player-artist").innerHTML =
					song.artist.name;
				document.querySelector("#player-lang").innerHTML =
					song.language;
			}
		}
	});
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

function togglePlay(audio) {
	if (audio.paused) {
		document.querySelector("#player-play").innerHTML = "pause";
		audio.play();
	} else {
		audio.nextElementSibling.innerHTML = "";
		document.querySelector("#player-play").innerHTML = "play_arrow";
		audio.pause();
	}
}

const skipNext = (currentTrack) => {
	const currentAudio = currentTrack.children[3].children[0];
	const nextTrack = currentTrack.parentElement.nextElementSibling.children[0];
	if (currentTrack.parentElement.nextElementSibling) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentTrack.classList.remove("active");
		nextTrack.classList.add("active");
		nextTrack.children[3].children[0].play();
	}
};

const skipPrev = (currentTrack) => {
	const currentAudio = currentTrack.children[3].children[0];
	const prevTrack =
		currentTrack.parentElement.previousElementSibling.children[0];
	if (currentTrack.parentElement.previousElementSibling) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		currentTrack.classList.remove("active");
		prevTrack.classList.add("active");
		prevTrack.children[3].children[0].play();
	}
};

function initProgressBar(audio) {
	let progressbar = document.getElementById("player-progress");
	progressbar.value = audio.currentTime / audio.duration;
}
