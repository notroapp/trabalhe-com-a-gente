import "./footer.component.css";

const FooterComponents = () => {
    return (
        <>

            <footer id="Footer" className="footer" >
                <div className="footer-container">
                    <div className="footer-container-about">
                        <h1> Sobre o Projeto </h1>

                        <p> Olá, equipe da Notro! Meu nome é Victor Augusto e sou responsável por desenvolver esse desafio.</p>

                        <p>Aqui está a minha solução para o desafio de desenvolvedor Frontend.</p>

                        <p>Foi um projeto muito interessante e eu realmente gostei do processo de desenvolvimento.</p>
                        
                        <p>Dediquei bastante tempo e esforço para entregar uma aplicação que atendesse aos requisitos e fosse bem estruturada.</p>
                        
                        <p>Gostaria de ressaltar que sou um desenvolvedor completamente dedicado e apaixonado por programação.</p>
                        
                        <p>A aplicação foi construída em React, consumindo a API do GitHub para buscar e exibir repositórios com paginação.</p>
                        
                        <p>Além disso, implementei funcionalidades adicionais, como um sistema de ordenação/classificação e a possibilidade de favoritar repositórios no localStorage, permitindo que você tenha fácil acesso a eles mais tarde.</p>


                        <p> Então o que você achou desse projeto? </p>

                        <p> Esse é o meu email:
                            <a href="mailto:victor.augusto.desenvolvedor@gmail.com" target="_blank" rel="noopener noreferrer">
                                victor.augusto.desenvolvedor@gmail.com. </a>
                        </p>

                        <p> E se você quiser ver mais dos meus projetos, confiram o
                            <a href=" https://www.linkedin.com/in/victor-augusto-desenvolvedor/ " target="_blank"
                                rel="noopener noreferrer"> meu LinkedIn </a> ou o
                            <a href=" https://github.com/VictorAugustoRodriguesGomes " target="_blank"
                                rel="noopener noreferrer"> meu GitHub. </a>
                        </p>

                        <p> Para mais informações de contatos e afins, o
                            <a href="https://github.com/VictorAugustoRodriguesGomes/VictorAugustoRodriguesGomes/blob/main/src/doc/Victor%20Augusto%20Rodrigues%20Gomes%20-%20curr%C3%ADculo.pdf"
                                target="_blank" rel="noopener noreferrer"> meu currículo </a>
                            se encontra a sua disposição logo a baixo.
                        </p>

                        <p> Prepare-se para ser inspirado. Este é apenas o começo! </p>

                    </div>
                </div>

                <div className="footer-container-btn">
                    <a href="https://github.com/VictorAugustoRodriguesGomes/VictorAugustoRodriguesGomes/blob/main/src/doc/Victor%20Augusto%20Rodrigues%20Gomes%20-%20curr%C3%ADculo.pdf"
                        target="_blank" rel="noopener noreferrer" className="btn-primary">Baixar Currículo</a>

                    <a href="https://victor-augusto-dev.firebaseapp.com/" target="_blank" rel="noopener noreferrer"
                        className="btn-primary"> Meu Portfólio </a>

                    <a href="https://www.linkedin.com/in/victor-augusto-desenvolvedor/" target="_blank"
                        rel="noopener noreferrer" className="btn-primary"> Meu LinkedIn </a>

                    <a href="https://github.com/VictorAugustoRodriguesGomes" target="_blank" rel="noopener noreferrer"
                        className="btn-primary"> Meu GitHub </a>
                </div>

            </footer>

            <div className="copyrightText">
                <p>Copyright © 2025-Atual. Victor Augusto. Todos os direitos reservados.</p>
            </div>

        </>
    );
};

export default FooterComponents;