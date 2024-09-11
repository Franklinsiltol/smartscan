const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const uploadBtn = document.getElementById('upload-btn');
const shareBtn = document.getElementById('share-btn');
const nomeField = document.getElementById('nome');
const cargoField = document.getElementById('cargo');
const emailField = document.getElementById('email');
const telefoneField = document.getElementById('telefone');

// Inicializa a câmera traseira
navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: { exact: "environment" } }
})
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => console.error('Erro ao acessar a câmera traseira', error));

// Captura a imagem do vídeo
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    processImage(canvas);
});

// Processa a imagem usando Tesseract.js
function processImage(image) {
    Tesseract.recognize(image, 'por', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        extractInformation(text);
    });
}

// Extração de informações e permitindo edição manual
function extractInformation(text) {
    const lines = text.split('\n');
    nomeField.value = lines[0] || '';
    cargoField.value = lines[1] || '';
    emailField.value = lines.find(line => line.includes('@')) || '';
    telefoneField.value = lines.find(line => line.match(/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/)) || '';
}

// Compartilhar as informações
shareBtn.addEventListener('click', () => {
    const nome = nomeField.value;
    const cargo = cargoField.value;
    const email = emailField.value;
    const telefone = telefoneField.value;

    const shareData = {
        title: 'Informações de Contato',
        text: `Nome: ${nome}\nCargo: ${cargo}\nEmail: ${email}\nTelefone: ${telefone}`
    };

    navigator.share(shareData)
        .then(() => console.log('Informações compartilhadas com sucesso'))
        .catch((error) => console.error('Erro ao compartilhar', error));
});
