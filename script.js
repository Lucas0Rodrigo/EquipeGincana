document.addEventListener('DOMContentLoaded', function() {

    // tenta pegar container por id (CSS usa #brilhinhos-container) ou por classe
    let brilhinhosContainer = document.getElementById('brilhinhos-container') || document.querySelector('.brilhinhos-container');

    // se não existir, cria um com id (para casar com o CSS existente)
    if (!brilhinhosContainer) {
        brilhinhosContainer = document.createElement('div');
        brilhinhosContainer.id = 'brilhinhos-container';
        document.body.appendChild(brilhinhosContainer);
    }

    // --- EFEITO 1: Explosão de partículas para os botões ---
    function criarEfeitoParticulas(evento) {
        if (!brilhinhosContainer) return;
        const target = evento.currentTarget || evento.target;
        const rect = target.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 15; i++) {
            const brilho = document.createElement('div');
            brilho.className = 'brilhinho';

            // posição relativa ao viewport (container é fixed)
            brilho.style.left = centerX + 'px';
            brilho.style.top = centerY + 'px';

            const angle = (2 * Math.PI * i) / 15;
            const distance = 50 + Math.random() * 25;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            brilho.style.setProperty('--x', `${x}px`);
            brilho.style.setProperty('--y', `${y}px`);

            brilhinhosContainer.appendChild(brilho);

            setTimeout(() => {
                brilho.remove();
            }, 900);
        }
    }

    // --- EFEITO 2: Chuva de brilho para o emblema ---
    function criarChuvaDeBrilho(evento) {
        if (!brilhinhosContainer) return;
        const target = evento.currentTarget || evento.target;
        const rect = target.getBoundingClientRect();
        const quantidade = 30;

        for (let i = 0; i < quantidade; i++) {
            const brilho = document.createElement('div');
            brilho.className = 'brilho-chuva';

            const startX = rect.left + (Math.random() * rect.width);
            const startY = rect.top - 20 + (Math.random() * 20);

            brilho.style.left = startX + 'px';
            brilho.style.top = startY + 'px';
            brilho.style.animationDelay = `${Math.random() * 0.5}s`;

            brilhinhosContainer.appendChild(brilho);

            setTimeout(() => {
                brilho.remove();
            }, 2600);
        }
    }

    // --- Efeitos nos links de navegação ---
    const navLinks = document.querySelectorAll('nav a');
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', criarEfeitoParticulas);
        });
    }

    // emblema: tenta por id, depois por seletor (primeira imagem com "Emblema" no alt)
    const emblema = document.getElementById('emblema-equipe') || document.querySelector('img[alt*="Emblema"]');
    if (emblema) {
        emblema.addEventListener('click', criarChuvaDeBrilho);
    }

    // --- Modal da Galeria (mais robusto) ---
    const modal = document.getElementById("modal-galeria") || document.querySelector(".modal");
    const modalImg = modal ? (document.getElementById("img-modal") || modal.querySelector(".modal-content")) : null;
    const galleryImages = document.querySelectorAll(".grid-item");
    const span = modal ? modal.querySelector(".fechar") : null;
    const prevBtn = modal ? modal.querySelector(".prev") : null;
    const nextBtn = modal ? modal.querySelector(".next") : null;
    let currentIndex = -1;

    function openModal(index) {
        if (!modal || !modalImg || !galleryImages || galleryImages.length === 0) return;
        modal.style.display = "block";
        modalImg.src = galleryImages[index].src;
        currentIndex = index;
        // para acessibilidade: define atributo
        modal.setAttribute('aria-hidden', 'false');
    }

    if (galleryImages && galleryImages.length) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', function() {
                openModal(index);
            });
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
    }

    if (span) span.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) closeModal();
        });
    }

    function showImage(index) {
        if (!modalImg || !galleryImages || galleryImages.length === 0) return;
        modalImg.src = galleryImages[index].src;
        currentIndex = index;
    }

    function showNextImage() {
        if (!galleryImages || galleryImages.length === 0) return;
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        showImage(nextIndex);
    }

    function showPrevImage() {
        if (!galleryImages || galleryImages.length === 0) return;
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(prevIndex);
    }

    if (nextBtn) nextBtn.addEventListener('click', function(e){ e.stopPropagation(); showNextImage(); });
    if (prevBtn) prevBtn.addEventListener('click', function(e){ e.stopPropagation(); showPrevImage(); });

    document.addEventListener('keydown', function(e) {
        if (!modal || modal.style.display !== "block") return;
        if (e.key === 'ArrowRight') showNextImage();
        else if (e.key === 'ArrowLeft') showPrevImage();
        else if (e.key === 'Escape') closeModal();
    });

});
