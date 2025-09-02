const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let isHandToolActive = false;
let startX, startY, scrollX = 0, scrollY = 0;

// Array untuk menyimpan langkah-langkah menggambar
let drawingHistory = [];
let currentStep = -1;

// Tools
const pencilToolButton = document.getElementById('pencilTool');
const handToolButton = document.getElementById('handTool');
const colorPicker = document.getElementById('colorPicker');
const clearCanvasButton = document.getElementById('clearCanvas');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

// Event listeners for tools
pencilToolButton.addEventListener('click', () => {
    isHandToolActive = false;
    canvas.style.cursor = 'crosshair';
});

handToolButton.addEventListener('click', () => {
    isHandToolActive = true;
    canvas.style.cursor = 'grab';
});

colorPicker.addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});

clearCanvasButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveDrawingState(); // Simpan keadaan setelah clear
});

undoButton.addEventListener('click', undoLastStep);
redoButton.addEventListener('click', redoNextStep);

// Fungsi untuk menyimpan keadaan canvas
function saveDrawingState() {
    // Hapus langkah-langkah setelah currentStep (jika ada)
    if (currentStep < drawingHistory.length - 1) {
        drawingHistory = drawingHistory.slice(0, currentStep + 1);
    }
    // Simpan gambar saat ini ke history
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawingHistory.push(imageData);
    currentStep++;
    updateUndoRedoButtons();
}

// Fungsi untuk mengembalikan langkah sebelumnya (undo)
function undoLastStep() {
    if (currentStep > 0) {
        currentStep--;
        ctx.putImageData(drawingHistory[currentStep], 0, 0);
        updateUndoRedoButtons();
    }
}

// Fungsi untuk mengulang langkah yang dibatalkan (redo)
function redoNextStep() {
    if (currentStep < drawingHistory.length - 1) {
        currentStep++;
        ctx.putImageData(drawingHistory[currentStep], 0, 0);
        updateUndoRedoButtons();
    }
}

// Fungsi untuk mengupdate status tombol undo dan redo
function updateUndoRedoButtons() {
    undoButton.disabled = currentStep <= 0; // Nonaktifkan undo jika tidak ada langkah sebelumnya
    redoButton.disabled = currentStep >= drawingHistory.length - 1; // Nonaktifkan redo jika tidak ada langkah selanjutnya
}

// Drawing logic
canvas.addEventListener('mousedown', (e) => {
    if (isHandToolActive) {
        startX = e.offsetX - scrollX;
        startY = e.offsetY - scrollY;
        canvas.style.cursor = 'grabbing';
    } else {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX - scrollX, e.offsetY - scrollY);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isHandToolActive && isDrawing) {
        scrollX = e.offsetX - startX;
        scrollY = e.offsetY - startY;
        canvas.style.transform = `translate(${scrollX}px, ${scrollY}px)`;
    } else if (isDrawing) {
        ctx.lineTo(e.offsetX - scrollX, e.offsetY - scrollY);
        ctx.stroke();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isHandToolActive) {
        canvas.style.cursor = 'grab';
    } else if (isDrawing) {
        saveDrawingState(); // Simpan keadaan setelah selesai menggambar
    }
    isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    if (isHandToolActive) {
        startX = offsetX - scrollX;
        startY = offsetY - scrollY;
    } else {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(offsetX - scrollX, offsetY - scrollY);
    }
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    if (isHandToolActive && isDrawing) {
        scrollX = offsetX - startX;
        scrollY = offsetY - startY;
        canvas.style.transform = `translate(${scrollX}px, ${scrollY}px)`;
    } else if (isDrawing) {
        ctx.lineTo(offsetX - scrollX, offsetY - scrollY);
        ctx.stroke();
    }
    e.preventDefault(); // Mencegah scroll pada perangkat touch
});

canvas.addEventListener('touchend', () => {
    if (!isHandToolActive && isDrawing) {
        saveDrawingState(); // Simpan keadaan setelah selesai menggambar
    }
    isDrawing = false;
});

// Initialize canvas settings
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.strokeStyle = colorPicker.value;

// Simpan keadaan awal canvas
saveDrawingState();