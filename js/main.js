const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const itens = document.querySelectorAll('.item');
const dots = document.querySelectorAll('.dot');
const numberIndicator = document.querySelector('.numbers');
const buttons = document.querySelectorAll('.btn');
const container = document.querySelector('.container');

let active = 0;
const total = itens.length;
let timer;

// Função para resetar o timer do auto-play quando o usuário interage
function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        update(1);
    }, 8000);
}

function update(direction) {
    // 1. Remove classes ativas atuais
    document.querySelector('.item.active').classList.remove('active');
    document.querySelector('.dot.active').classList.remove('active');

    // 2. Fecha qualquer descrição que esteja aberta ao mudar de slide
    document.querySelectorAll('.description.expand').forEach(desc => {
        desc.classList.remove('expand');
    });
    document.querySelectorAll('.btn').forEach(btn => {
        btn.innerText = 'Saiba Mais';
    });

    // 3. Calcula o próximo índice
    if (direction > 0) {
        active = (active + 1) % total;
    } else {
        active = (active - 1 + total) % total;
    }

    // 4. Aplica as novas classes
    itens[active].classList.add('active');
    dots[active].classList.add('active');

    // 5. Atualiza o número (se estiver visível)
    if (numberIndicator) {
        numberIndicator.textContent = String(active + 1).padStart(2, '0');
    }
    
    resetTimer(); // Reinicia o contador de 8s após a mudança
}

// Inicializa o timer pela primeira vez
resetTimer();

// Eventos dos botões de navegação
prevButton.addEventListener('click', () => update(-1));
nextButton.addEventListener('click', () => update(1));

// Lógica do botão "Saiba Mais" / "Ler Menos"
buttons.forEach(button => {
    // Usamos 'click' com preventDefault para evitar conflitos no mobile
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const item = this.closest('.item');
        const description = item.querySelector('.description');
        
        if (description) {
            description.classList.toggle('expand');
            this.innerText = description.classList.contains('expand') ? 'Ler menos' : 'Saiba Mais';
            
            // Pausa o carrossel se abrir, volta se fechar
            if (description.classList.contains('expand')) {
                clearInterval(timer);
            } else {
                resetTimer();
            }
        }
    }, { capture: true }); // O 'capture' faz o clique ser prioridade máxima
});

// Lógica de Swipe (Deslizar)
let touchStartX = 0;
let touchEndX = 0;

container.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

container.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 50;

    if (touchEndX < touchStartX - threshold) update(1); // Swipe Esquerda
    if (touchEndX > touchStartX + threshold) update(-1); // Swipe Direita
}, { passive: true });

// Destaca o link da página atual no menu
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});