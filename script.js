/* ================= toggle icon navbar (Menu Mobile) ================= */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); // Transforma o ícone de menu em X
    navbar.classList.toggle('active'); // Mostra/esconde o menu
};

/* ================= scroll sections active link ================= */
// Isso faz o link do menu ficar colorido conforme você rola a página
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    /* ================= sticky navbar ================= */
    // Adiciona uma sombra suave ao menu quando rola para baixo
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    /* ================= remove toggle icon and navbar when click navbar link (scroll) ================= */
    // Fecha o menu mobile automaticamente quando clica em um link
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


/* ================= typed js (Efeito de digitação) ================= */
// Se não quiser o efeito, pode apagar esta parte e remover o script do HTML
if (document.querySelector('.multiple-text')) {
    const typed = new Typed('.multiple-text', {
        strings: ['Alta Performance', 'Landing Pages Rápidas', 'Código Puro (HTML/CSS)'],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
}