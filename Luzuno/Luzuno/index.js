const playlist = [
    "audio/Blue   Yung kai (𝙇𝙮𝙧𝙞𝙘𝙨+𝙎𝙥𝙚𝙙 𝙪𝙥)-kaii.mp3",
    "audio/song2.mp3",
    "audio/song3.mp3"
];
let currentTrack = localStorage.getItem("currentTrack") ? parseInt(localStorage.getItem("currentTrack")) : 0;
let audio = document.getElementById("audio");
let playButton = document.getElementById("play");
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");
let volumeControl = document.getElementById("volume");

// Muat state dari localStorage
audio.src = playlist[currentTrack];
audio.volume = localStorage.getItem("audioVolume") ? parseFloat(localStorage.getItem("audioVolume")) : 1;
volumeControl.value = audio.volume;

if (localStorage.getItem("audioTime")) {
    audio.currentTime = parseFloat(localStorage.getItem("audioTime"));
}

// Fungsi untuk toggle play/pause
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playButton.innerHTML = "❚❚"; // Ikon Pause
    } else {
        audio.pause();
        playButton.innerHTML = "►"; // Ikon Play
    }
}

// Fungsi untuk memutar track berikutnya
function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    localStorage.setItem("currentTrack", currentTrack);
    audio.src = playlist[currentTrack];
    audio.play();
    playButton.innerHTML = "❚❚";
}

// Fungsi untuk memutar track sebelumnya
function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    localStorage.setItem("currentTrack", currentTrack);
    audio.src = playlist[currentTrack];
    audio.play();
    playButton.innerHTML = "❚❚";
}

// Atur volume
volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value;
    localStorage.setItem("audioVolume", audio.volume);
});

// Event listener untuk tombol
playButton.addEventListener("click", togglePlay);
nextButton.addEventListener("click", nextTrack);
prevButton.addEventListener("click", prevTrack);

// Simpan posisi waktu lagu saat halaman ditutup
window.addEventListener("beforeunload", () => {
    localStorage.setItem("audioTime", audio.currentTime);
});

// Otomatis lanjutkan pemutaran jika sebelumnya sedang play
if (localStorage.getItem("audioPlaying") === "true") {
    audio.play();
    playButton.innerHTML = "❚❚";
}

// Simpan status pemutaran saat audio diputar/dijeda
audio.addEventListener("play", () => {
    localStorage.setItem("audioPlaying", "true");
});
audio.addEventListener("pause", () => {
    localStorage.setItem("audioPlaying", "false");
});