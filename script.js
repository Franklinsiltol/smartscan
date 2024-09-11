const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const shareBtn = document.getElementById('share-btn');
const nomeField = document.getElementById('nome');
const enderecoField = document.getElementById('endereco');
const emailField = document.getElementById('email');
const telefoneField = document.getElementById('telefone');
const results = document.getElementById('results');
const overlay = document.getElementById('overlay');

// Inicializa a câmera traseira
navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: 'environment' } }
})
.then(stream => {
    video.srcObject = stream;
    video.play();
})
.catch(error => console.error('Erro ao acessar a câmera traseira', error));

// Captura a imagem do vídeo
captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.style.display = 'none';
    captureBtn.style.display = 'none';
    canvas.style.display = 'block';
    overlay.style.display = 'flex';

    processImage(canvas);
});

// Processa a imagem usando Tesseract.js
function processImage(image) {
    Tesseract.recognize(image, 'por', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        extractInformation(text);
        overlay.style.display = 'none';
        results.classList.remove('hidden');
        shareBtn.classList.remove('hidden');
    }).catch(error => {
        console.error('Erro no processamento de imagem', error);
        overlay.style.display = 'none';
    });
}

// Extração de informações e permitindo edição manual
function extractInformation(text) {
    const lines = text.split('\n');
    nomeField.value = lines[0] || '';
    enderecoField.value = lines[1] || '';
    emailField.value = lines.find(line => line.includes('@')) || '';
    telefoneField.value = lines.find(line => line.match(/(\(?\d{2}\)?\s)?(\d{4,5}\-\d{4})/)) || '';
}

// Compartilhar as informações
shareBtn.addEventListener('click', () => {
    const nome = nomeField.value;
    const endereco = enderecoField.value;
    const email = emailField.value;
    const telefone = telefoneField.value;

    const shareData = {
        title: 'Informações de Contato',
        text: `Nome: ${nome}\nEndereço: ${endereco}\nEmail: ${email}\nTelefone: ${telefone}`
    };

    navigator.share(shareData)
        .then(() => console.log('Informações compartilhadas com sucesso'))
        .catch((error) => console.error('Erro ao compartilhar', error));
});
