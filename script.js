document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       CONFIGURAÇÕES GERAIS
    ========================================================= */

    const body = document.body;
    const html = document.documentElement;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =========================================================
       ANO AUTOMÁTICO
    ========================================================= */

    document.querySelectorAll("[data-ano]").forEach(elemento => {
        elemento.textContent = new Date().getFullYear();
    });


    /* =========================================================
       HEADER / NAVEGAÇÃO
    ========================================================= */

    const header = document.querySelector("header");
    const menu = document.querySelector(".menu");
    const menuBotao = document.querySelector(
        ".menu-botao, .menu-toggle, .hamburguer, [data-menu]"
    );

    const linksMenu = document.querySelectorAll(
        ".menu a, .navegacao a, nav a"
    );


    function atualizarHeader() {

        if (!header) return;

        if (window.scrollY > 60) {
            header.classList.add("header-scroll");
            header.classList.add("scrolled");
        } else {
            header.classList.remove("header-scroll");
            header.classList.remove("scrolled");
        }

    }


    window.addEventListener("scroll", atualizarHeader, {
        passive: true
    });

    atualizarHeader();


    /* =========================================================
       MENU MOBILE
    ========================================================= */

    function fecharMenu() {

        if (menu) {
            menu.classList.remove("menu-aberto");
            menu.classList.remove("ativo");
        }

        if (menuBotao) {
            menuBotao.classList.remove("ativo");
            menuBotao.setAttribute("aria-expanded", "false");
        }

        body.classList.remove("menu-aberto");
    }


    if (menuBotao) {

        menuBotao.setAttribute("aria-expanded", "false");

        menuBotao.addEventListener("click", () => {

            if (!menu) return;

            const aberto =
                menu.classList.contains("menu-aberto") ||
                menu.classList.contains("ativo");

            if (aberto) {
                fecharMenu();
            } else {

                menu.classList.add("menu-aberto");
                menu.classList.add("ativo");

                menuBotao.classList.add("ativo");
                menuBotao.setAttribute("aria-expanded", "true");

                body.classList.add("menu-aberto");
            }

        });

    }


    linksMenu.forEach(link => {

        link.addEventListener("click", () => {
            fecharMenu();
        });

    });


    /* =========================================================
       ESC FECHA MENU
    ========================================================= */

    document.addEventListener("keydown", evento => {

        if (evento.key === "Escape") {
            fecharMenu();
        }

    });


    /* =========================================================
       SCROLL SUAVE
    ========================================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", evento => {

            const destinoId = link.getAttribute("href");

            if (
                !destinoId ||
                destinoId === "#" ||
                destinoId.length < 2
            ) {
                return;
            }

            const destino = document.querySelector(destinoId);

            if (!destino) return;

            evento.preventDefault();

            const alturaHeader = header
                ? header.offsetHeight
                : 0;

            const posicao =
                destino.getBoundingClientRect().top +
                window.scrollY -
                alturaHeader -
                20;

            window.scrollTo({
                top: posicao,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

        });

    });


    /* =========================================================
       ANIMAÇÕES DE ENTRADA
    ========================================================= */

    const elementosAnimados = document.querySelectorAll(
        ".revelar, " +
        ".fade-in, " +
        ".fade-up, " +
        ".animar, " +
        "[data-reveal]"
    );


    if (
        elementosAnimados.length > 0 &&
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        const observerRevelacao = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add(
                        "visivel",
                        "ativo",
                        "revelado"
                    );

                    observer.unobserve(entrada.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px"
            }
        );


        elementosAnimados.forEach(elemento => {

            elemento.classList.add("aguardando-revelacao");

            observerRevelacao.observe(elemento);

        });

    } else {

        elementosAnimados.forEach(elemento => {

            elemento.classList.add(
                "visivel",
                "ativo",
                "revelado"
            );

        });

    }


    /* =========================================================
       STAGGER AUTOMÁTICO
       ========================================================= */

    const gruposStagger = document.querySelectorAll(
        ".especialidades, " +
        ".servicos, " +
        ".projetos, " +
        ".depoimentos, " +
        ".biografia-linha"
    );


    gruposStagger.forEach(grupo => {

        const itens = grupo.querySelectorAll(
            ".especialidade, " +
            ".servico, " +
            ".projeto, " +
            ".depoimento, " +
            ".biografia-item"
        );

        itens.forEach((item, index) => {

            item.style.setProperty(
                "--delay",
                `${index * 100}ms`
            );

        });

    });


    /* =========================================================
       CONTADORES
    ========================================================= */

    const contadores = document.querySelectorAll(
        "[data-contador]"
    );


    function animarContador(elemento) {

        const valorFinal = parseInt(
            elemento.dataset.contador,
            10
        );

        if (Number.isNaN(valorFinal)) return;

        const duracao = 1800;
        const inicio = performance.now();


        function atualizar(tempoAtual) {

            const progresso = Math.min(
                (tempoAtual - inicio) / duracao,
                1
            );

            const suavizacao =
                1 - Math.pow(1 - progresso, 3);

            const valorAtual = Math.floor(
                suavizacao * valorFinal
            );

            elemento.textContent =
                valorAtual.toLocaleString("pt-BR");


            if (progresso < 1) {

                requestAnimationFrame(atualizar);

            } else {

                elemento.textContent =
                    valorFinal.toLocaleString("pt-BR");

            }

        }


        requestAnimationFrame(atualizar);

    }


    if (
        contadores.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observerContadores = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) return;

                    if (!entrada.target.dataset.animado) {

                        entrada.target.dataset.animado = "true";

                        if (prefersReducedMotion) {

                            const valor = parseInt(
                                entrada.target.dataset.contador,
                                10
                            );

                            entrada.target.textContent =
                                valor.toLocaleString("pt-BR");

                        } else {

                            animarContador(
                                entrada.target
                            );

                        }

                    }

                    observer.unobserve(entrada.target);

                });

            },
            {
                threshold: 0.6
            }
        );


        contadores.forEach(contador => {

            observerContadores.observe(contador);

        });

    }


    /* =========================================================
       FILTRO DE PROJETOS
    ========================================================= */

    const filtrosProjetos = document.querySelectorAll(
        "[data-filtro]"
    );

    const projetos = document.querySelectorAll(
        "[data-categoria]"
    );


    filtrosProjetos.forEach(filtro => {

        filtro.addEventListener("click", () => {

            const categoria =
                filtro.dataset.filtro;


            filtrosProjetos.forEach(item => {

                item.classList.remove("ativo");

            });


            filtro.classList.add("ativo");


            projetos.forEach(projeto => {

                const categoriaProjeto =
                    projeto.dataset.categoria;


                const mostrar =
                    categoria === "todos" ||
                    categoriaProjeto === categoria;


                if (mostrar) {

                    projeto.removeAttribute("hidden");

                    requestAnimationFrame(() => {

                        projeto.classList.remove(
                            "projeto-oculto"
                        );

                    });

                } else {

                    projeto.classList.add(
                        "projeto-oculto"
                    );

                    setTimeout(() => {

                        if (
                            projeto.classList.contains(
                                "projeto-oculto"
                            )
                        ) {
                            projeto.setAttribute(
                                "hidden",
                                ""
                            );
                        }

                    }, 400);

                }

            });

        });

    });


    /* =========================================================
       EFEITO PARALLAX
    ========================================================= */

    const elementosParallax = document.querySelectorAll(
        "[data-parallax]"
    );


    if (
        elementosParallax.length > 0 &&
        !prefersReducedMotion
    ) {

        let ticking = false;


        function atualizarParallax() {

            const scrollAtual = window.scrollY;


            elementosParallax.forEach(elemento => {

                const intensidade =
                    parseFloat(
                        elemento.dataset.parallax
                    ) || 0.08;

                const movimento =
                    scrollAtual * intensidade;

                elemento.style.transform =
                    `translate3d(0, ${movimento}px, 0)`;

            });


            ticking = false;

        }


        window.addEventListener("scroll", () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    atualizarParallax
                );

                ticking = true;

            }

        }, {
            passive: true
        });

    }


    /* =========================================================
       CURSOR PERSONALIZADO
    ========================================================= */

    const cursor = document.querySelector(
        ".cursor, .cursor-personalizado"
    );

    const cursorSeguidor = document.querySelector(
        ".cursor-seguidor, .cursor-outline"
    );


    if (
        cursor &&
        cursorSeguidor &&
        !prefersReducedMotion &&
        window.matchMedia("(pointer: fine)").matches
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let cursorX = 0;
        let cursorY = 0;

        let seguidorX = 0;
        let seguidorY = 0;


        document.addEventListener("mousemove", evento => {

            mouseX = evento.clientX;
            mouseY = evento.clientY;

        });


        function animarCursor() {

            cursorX +=
                (mouseX - cursorX) * 0.35;

            cursorY +=
                (mouseY - cursorY) * 0.35;

            seguidorX +=
                (mouseX - seguidorX) * 0.12;

            seguidorY +=
                (mouseY - seguidorY) * 0.12;


            cursor.style.transform =
                `translate3d(${cursorX}px, ${cursorY}px, 0)`;


            cursorSeguidor.style.transform =
                `translate3d(${seguidorX}px, ${seguidorY}px, 0)`;


            requestAnimationFrame(animarCursor);

        }


        animarCursor();


        const elementosInterativos =
            document.querySelectorAll(
                "a, button, input, textarea, select, [role='button']"
            );


        elementosInterativos.forEach(elemento => {

            elemento.addEventListener("mouseenter", () => {

                cursor.classList.add("cursor-hover");
                cursorSeguidor.classList.add(
                    "cursor-hover"
                );

            });


            elemento.addEventListener("mouseleave", () => {

                cursor.classList.remove("cursor-hover");
                cursorSeguidor.classList.remove(
                    "cursor-hover"
                );

            });

        });

    }


    /* =========================================================
       IMAGENS — LAZY LOADING
    ========================================================= */

    document.querySelectorAll("img").forEach(imagem => {

        if (!imagem.hasAttribute("loading")) {

            imagem.setAttribute(
                "loading",
                "lazy"
            );

        }

        imagem.addEventListener("error", () => {

            imagem.classList.add("imagem-indisponivel");

        });

    });


    /* =========================================================
       LINKS EXTERNOS
    ========================================================= */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        const relAtual =
            link.getAttribute("rel") || "";

        if (!relAtual.includes("noopener")) {

            link.setAttribute(
                "rel",
                `${relAtual} noopener noreferrer`.trim()
            );

        }

    });


    /* =========================================================
       BOTÃO VOLTAR AO TOPO
    ========================================================= */

    const voltarTopo = document.querySelector(
        ".voltar-topo, [data-voltar-topo]"
    );


    if (voltarTopo) {

        function verificarTopo() {

            if (window.scrollY > 500) {

                voltarTopo.classList.add("visivel");
                voltarTopo.classList.add("ativo");

            } else {

                voltarTopo.classList.remove("visivel");
                voltarTopo.classList.remove("ativo");

            }

        }


        window.addEventListener(
            "scroll",
            verificarTopo,
            { passive: true }
        );


        verificarTopo();


        voltarTopo.addEventListener("click", evento => {

            evento.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

        });

    }


    /* =========================================================
       NAVEGAÇÃO ATIVA
    ========================================================= */

    const secoes = document.querySelectorAll(
        "main section[id], section[id]"
    );

    const linksSecoes = document.querySelectorAll(
        'nav a[href^="#"], .menu a[href^="#"]'
    );


    if (
        secoes.length > 0 &&
        linksSecoes.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const observerSecoes = new IntersectionObserver(
            entradas => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) return;

                    const id =
                        entrada.target.getAttribute("id");


                    linksSecoes.forEach(link => {

                        link.classList.remove("secao-ativa");

                        const href =
                            link.getAttribute("href");

                        if (href === `#${id}`) {

                            link.classList.add(
                                "secao-ativa"
                            );

                        }

                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );


        secoes.forEach(secao => {

            observerSecoes.observe(secao);

        });

    }


    /* =========================================================
       PROTEÇÃO DE FORMULÁRIOS
    ========================================================= */

    const formularios =
        document.querySelectorAll("form");


    formularios.forEach(formulario => {

        formulario.addEventListener(
            "submit",
            evento => {

                const botao =
                    formulario.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );


                if (botao) {

                    botao.classList.add(
                        "enviando"
                    );

                }

            }
        );

    });


    /* =========================================================
       FEEDBACK VISUAL DE LINKS
    ========================================================= */

    document.querySelectorAll(
        "a"
    ).forEach(link => {

        link.addEventListener(
            "click",
            () => {

                link.classList.add(
                    "link-clicado"
                );

                setTimeout(() => {

                    link.classList.remove(
                        "link-clicado"
                    );

                }, 500);

            }
        );

    });


    /* =========================================================
       ANIMAÇÃO INICIAL
    ========================================================= */

    requestAnimationFrame(() => {

        body.classList.add("pagina-carregada");

    });


    /* =========================================================
       PREVENÇÃO DE FLASH DE ELEMENTOS ANIMADOS
    ========================================================= */

    if (
        !prefersReducedMotion &&
        elementosAnimados.length > 0
    ) {

        document.documentElement.classList.add(
            "animacoes-habilitadas"
        );

    }


    /* =========================================================
       CONSOLE
    ========================================================= */

    console.log(
        "%cCamila Domingues",
        "font-size: 22px; font-weight: 700;"
    );

    console.log(
        "%cCreative Professional · Filmmaker · Social Media · Designer · Video Editor",
        "font-size: 11px;"
    );

});