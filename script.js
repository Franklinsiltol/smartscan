const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const nomeField = document.getElementById('nome');
const enderecoField = document.getElementById('endereco');
const emailField = document.getElementById('email');
const telefoneField = document.getElementById('telefone');
const results = document.getElementById('results');
const loadingOverlay = document.getElementById('loading-overlay');
const shareBtn = document.getElementById('share-btn');
const newScanBtn = document.getElementById('new-scan-btn');

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
    canvas.style.display = 'block';
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Exibe o overlay de loading
    loadingOverlay.style.display = 'flex';

    processImage(canvas);
});

// Processa a imagem usando Tesseract.js
function processImage(image) {
    Tesseract.recognize(image, 'por', {
        logger: m => console.log(m)
    }).then(({ data: { text } }) => {
        extractInformation(text);
        loadingOverlay.style.display = 'none';  // Esconde o overlay após o processamento
        results.classList.remove('hidden');
        shareBtn.classList.remove('hidden');
        newScanBtn.classList.remove('hidden');
    }).catch(error => {
        console.error('Erro no processamento de imagem', error);
        loadingOverlay.style.display = 'none';  // Esconde o overlay em caso de erro
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

// Compartilhar informações
shareBtn.addEventListener('click', () => {
    const nome = nomeField.value;
    const endereco = enderecoField.value;
    const email = emailField.value;
    const telefone = telefoneField.value;

    const textToShare = `
        Nome: ${nome}
        Endereço: ${endereco}
        Email: ${email}
        Telefone: ${telefone}
    `;

    navigator.share({
        title: 'Informações do Cartão de Visita',
        text: textToShare,
        url: window.location.href
    }).then(() => console.log('Informações compartilhadas com sucesso'))
      .catch((error) => console.error('Erro ao compartilhar', error));
});

// Novo Scan
newScanBtn.addEventListener('click', () => {
    video.style.display = 'block';
    captureBtn.style.display = 'block';
    canvas.style.display = 'none';
    results.classList.add('hidden');
    shareBtn.classList.add('hidden');
    newScanBtn.classList.add('hidden');
});
