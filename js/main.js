// --- LÓGICA DO CARROSSEL (HOME) ---
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const itens = document.querySelectorAll('.item');
const dots = document.querySelectorAll('.dot');
const numberIndicator = document.querySelector('.numbers');
const buttons = document.querySelectorAll('.btn');
const container = document.querySelector('.container');

// Só executa se estiver na página da Home
if (container && prevButton && nextButton) {
    let active = 0;
    const total = itens.length;
    let timer;

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(() => { update(1); }, 8000);
    }

    function update(direction) {
        document.querySelector('.item.active').classList.remove('active');
        document.querySelector('.dot.active').classList.remove('active');

        document.querySelectorAll('.description.expand').forEach(desc => desc.classList.remove('expand'));
        document.querySelectorAll('.btn').forEach(btn => btn.innerText = 'Saiba Mais');

        active = direction > 0 ? (active + 1) % total : (active - 1 + total) % total;

        itens[active].classList.add('active');
        dots[active].classList.add('active');
        if (numberIndicator) numberIndicator.textContent = String(active + 1).padStart(2, '0');
        resetTimer();
    }

    resetTimer();
    prevButton.addEventListener('click', () => update(-1));
    nextButton.addEventListener('click', () => update(1));

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const item = this.closest('.item');
            const description = item.querySelector('.description');
            if (description) {
                description.classList.toggle('expand');
                this.innerText = description.classList.contains('expand') ? 'Ler menos' : 'Saiba Mais';
                description.classList.contains('expand') ? clearInterval(timer) : resetTimer();
            }
        }, { capture: true });
    });

    // Lógica de Swipe
    let touchStartX = 0;
    container.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    container.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) update(1);
        if (touchEndX > touchStartX + 50) update(-1);
    }, { passive: true });
}

// --- LÓGICA DO FILTRO DE PRODUTOS ---
function filtrarProdutos(categoria) {
    const cards = document.querySelectorAll('.card-produto');
    const botoes = document.querySelectorAll('.btn-filtro');

    botoes.forEach(btn => btn.classList.remove('active'));
    
    // Identifica o botão clicado corretamente
    const btnClicado = event.currentTarget;
    btnClicado.classList.add('active');

    cards.forEach(card => {
        // Usamos 'flex' para manter seu layout, ou '' para remover o display inline
        if (categoria === 'todos' || card.getAttribute('data-categoria') === categoria) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- LÓGICA DO MENU (Ativo) ---
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});