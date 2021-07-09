const audios = document.querySelectorAll("audio");

function pauseOtherAudios(a) {
	for (const audio of audios) {
		if (audio !== a) {
			audio.parentElement.parentElement.classList.remove("active");
			audio.nextElementSibling.innerHTML = "";
			audio.pause();
			audio.currentTime = 0;
		}
	}
}

for (const audio of audios) {
	audio.addEventListener("play", () => {
		audio.parentElement.parentElement.classList.add("active");
		pauseOtherAudios(audio);
		audio.nextElementSibling.innerHTML = "play_arrow";
	});
	audio.addEventListener("timeupdate", () => {
		if (audio.currentTime === audio.duration) {
			audio.pause();
			audio.nextElementSibling.innerHTML = "";
		}
	});
}

function togglePlay(audio) {
	if (audio.paused) {
		audio.nextElementSibling.innerHTML = "play_arrow";
		audio.play();
	} else {
		audio.nextElementSibling.innerHTML = "";
		audio.pause();
	}
}
