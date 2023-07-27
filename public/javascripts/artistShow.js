const audios = document.querySelectorAll("audio");

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

for (const audio of audios) {
	audio.addEventListener("timeupdate", () => {
		if (audio.currentTime === audio.duration) {
			audio.pause();
			audio.nextElementSibling.innerHTML = "";
		}
	});
}

function togglePlay(audio) {
	if (audio.paused) {
		if (!audio.src) {
			audio.src = audio.getAttribute("data-src");
		}

		audio.parentElement.parentElement.classList.add("active");
		audio.nextElementSibling.innerHTML = "play_arrow";

		pauseOtherAudios(audio);
		audio.play();
	} else {
		audio.nextElementSibling.innerHTML = "";
		audio.pause();
	}
}
