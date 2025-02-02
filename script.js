const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fungsi untuk memformat teks
function formatText(text) {
  // Ganti **teks** dengan <strong>teks</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Ganti ``` dengan <pre><code>...</code></pre>
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Ganti \n dengan <br>
  text = text.replace(/\n/g, '<br>');

  return text;
}

// Fungsi untuk menambahkan pesan ke chat box
function addMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerHTML = formatText(message); // Gunakan innerHTML
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll ke bawah
}

// Fungsi untuk menampilkan loading sebagai pesan AI
function showLoading() {
  const loadingElement = document.createElement('div');
  loadingElement.classList.add('message', 'ai-message', 'loading');
  loadingElement.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `;
  chatBox.appendChild(loadingElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  return loadingElement;
}

// Fungsi untuk menyembunyikan loading
function hideLoading(loadingElement) {
  if (loadingElement) {
    loadingElement.remove();
  }
}

// Fungsi untuk mengambil respons dari API
async function getAIResponse(userMessage) {
  const apiUrl = `https://fastrestapis.fasturl.cloud/aillm/gpt-4?ask=${encodeURIComponent(userMessage)}&style=Resa%20AI%20di%20sini!%20Dibuat%20oleh%20Renaldi%20(Renal)%20dan%20Maria%20Chelsa%20(Chelsa),%20pacarnya%20yang%20cantik,%20imut,%20lucu,%20dan%20cintanya%20Renal.%20Gw%20siap%20nemenin%20lu%20dengan%20bahasa%20gaul.%20Yuk,%20ngobrol!`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 200) {
      return data.result; // Ambil pesan dari kunci "result"
    } else {
      return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi server.";
  }
}

// Event listener untuk tombol kirim
sendBtn.addEventListener('click', async () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage('user-message', userMessage);
    userInput.value = ''; // Kosongkan input

    // Tampilkan loading sebagai pesan AI
    const loadingElement = showLoading();

    // Ambil respons dari API
    const aiResponse = await getAIResponse(userMessage);

    // Sembunyikan loading dan tampilkan respons AI dengan animasi typing
    hideLoading(loadingElement);
    const typingMessage = document.createElement('div');
    typingMessage.classList.add('message', 'ai-message');
    typingMessage.innerHTML = formatText(aiResponse);
    chatBox.appendChild(typingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

// Event listener untuk tombol Enter
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});
