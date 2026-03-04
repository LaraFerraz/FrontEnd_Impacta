import React from "react";
import "./Sobre.css";

function Sobre() {
    return (
        <section className="sobre-container">
            <h1>Sobre a Impacta</h1>
            <p>
                A Impacta é uma plataforma criada para conectar pessoas a projetos, campanhas e ações sociais que geram transformação real na comunidade.
            </p>
            <p>
                Nosso propósito é facilitar o encontro entre quem deseja ajudar e quem precisa de apoio, promovendo impacto social por meio da participação ativa, do voluntariado e da colaboração.
            </p>
            <p>
                Acreditamos que pequenas ações, quando somadas, geram grandes mudanças. Por isso, oferecemos um ambiente digital moderno, seguro e acessível, onde usuários podem descobrir iniciativas, participar de campanhas e acompanhar seu próprio histórico de contribuição.
            </p>
            <h2>Transformação com Propósito</h2>
            <p>
                A Impacta nasce da ideia de que a transformação começa com movimento. E quando pessoas se conectam com propósito, o impacto se torna inevitável.
            </p>

            <div className="mvv">
                <div className="mvv-card">
                    <h3>Missão</h3>
                    <p>Conectar pessoas a iniciativas sociais que promovem transformação real nas comunidades.</p>
                </div>

                <div className="mvv-card">
                    <h3>Visão</h3>
                    <p>Ser referência digital em engajamento social e voluntariado no Brasil.</p>
                </div>

                <div className="mvv-card">
                    <h3>Valores</h3>
                    <p>Transparência, colaboração, responsabilidade social e compromisso com o impacto positivo.</p>
                </div>
            </div>

            <div className="como-funciona">

                <div className="como-funciona">
                    <h2>Como Funciona</h2>

                    <div className="passos">

                        <div className="card-passo">
                            <div className="numero">1</div>
                            <h3>Crie sua conta</h3>
                            <p>Cadastre-se gratuitamente e faça parte da nossa comunidade.</p>
                        </div>

                        <div className="card-passo">
                            <div className="numero">2</div>
                            <h3>Encontre projetos</h3>
                            <p>Descubra campanhas e iniciativas sociais que combinam com você.</p>
                        </div>

                        <div className="card-passo">
                            <div className="numero">3</div>
                            <h3>Gere impacto</h3>
                            <p>Participe das ações e acompanhe a diferença que você está fazendo.</p>
                        </div>

                    </div>
                </div>

                <div className="impacto">
                    <h2>Nosso Impacto</h2>

                    <div className="impacto-grid">
                        <div className="impacto-card">
                            <h3>+120</h3>
                            <p>Campanhas Criadas</p>
                        </div>

                        <div className="impacto-card">
                            <h3>+3.500</h3>
                            <p>Pessoas Engajadas</p>
                        </div>

                        <div className="impacto-card">
                            <h3>+15.000</h3>
                            <p>Impactos Gerados</p>
                        </div>
                    </div>
                </div>

                <div className="cta-sobre">
                    <h3>Pronto para fazer parte da mudança?</h3>
                    <p>Junte-se à Impacta e transforme pequenas ações em grandes resultados.</p>
                    <button className="btn-secondary">
                        Explorar Campanhas
                    </button>
                </div>
            </div>
        </section >
    );
}

export default Sobre;