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

// --- LÓGICA DO FILTRO DE PRODUTOS (DESKTOP) ---
function filtrarProdutos(categoria, elementoClicado = null) {
    const cards = document.querySelectorAll('.card-produto');
    const botoes = document.querySelectorAll('.btn-filtro');

    // Remove a classe active de todos os botões do desktop
    botoes.forEach(btn => btn.classList.remove('active'));
    
    // Se o elemento foi passado direto (Desktop), ativa ele
    if (elementoClicado) {
        elementoClicado.classList.add('active');
    } 
    // Caso contrário, tenta mapear pelo evento nativo se ele existir e for do desktop
    else if (window.event && window.event.currentTarget && typeof window.event.currentTarget.classList === 'function') {
        if (window.event.currentTarget.classList.contains('btn-filtro')) {
            window.event.currentTarget.classList.add('active');
        }
    }

    // Faz a filtragem dos cards normalmente
    cards.forEach(card => {
        if (categoria === 'todos' || card.getAttribute('data-categoria') === categoria) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- LÓGICA DO FILTRO MOBILE (ABRE DROPDOWN E FILTRA) ---
document.addEventListener("DOMContentLoaded", () => {
    const btnFiltroPrincipal = document.getElementById('btn-filtro-principal');
    const listaCategoriasMobile = document.getElementById('lista-categorias-mobile');

    // Executa apenas se os elementos mobile existirem na página atual
    if (btnFiltroPrincipal && listaCategoriasMobile) {
        
        // Abre e fecha o dropdown ao clicar no botão "Filtrar Categorias"
        btnFiltroPrincipal.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita fechar imediatamente pelo clique no documento
            listaCategoriasMobile.classList.toggle('show');
        });

        // Fecha o dropdown se o usuário clicar em qualquer outro lugar da tela
        document.addEventListener('click', () => {
            listaCategoriasMobile.classList.remove('show');
        });
    }
});

// Função chamada pelos botões internos do dropdown mobile
function executarFiltroMobile(categoria, nomeCategoria) {
    const listaCategoriasMobile = document.getElementById('lista-categorias-mobile');
    const btnFiltroPrincipal = document.getElementById('btn-filtro-principal');
    const opcoesFiltro = document.querySelectorAll('.opcao-filtro');

    // 1. Filtra os produtos reutilizando sua lógica estruturada
    filtrarProdutos(categoria);

    // 2. Atualiza o texto do botão principal com a categoria ativa e mantém a seta
    if (btnFiltroPrincipal) {
        btnFiltroPrincipal.innerHTML = `${nomeCategoria} <span class="seta-dropdown">▼</span>`;
    }

    // 3. Gerencia o estilo ativo entre as opções do dropdown mobile
    opcoesFiltro.forEach(opcao => opcao.classList.remove('active'));
    
    // Procura e destaca a opção clicada
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }

    // 4. Fecha o dropdown após a seleção
    if (listaCategoriasMobile) {
        listaCategoriasMobile.classList.remove('show');
    }
}