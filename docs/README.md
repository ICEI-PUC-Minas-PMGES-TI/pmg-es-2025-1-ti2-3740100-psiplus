# PSIPLUS


**Nico Jobski Andrade, jobskiandrade@gmail.com**

**Júlia de Souza Ventura, juliavt403@gmail.com**

**Rafael Rocha Caldeira Brant, rafaelrbrant07@gmail.com**

**Ana Luiza de Freitas Rodrigues, analuizafreitas12@yahoo.com.br**

**Kayke Emanoel de Souza Santos, kaykeeman@gmail.com**

**Carlos Eduardo Sousa Santos, cadusantos9000@gmail.com**

---

Professores:

**Michelle Hanne Soares de Andrade**

**Danilo de Quadra Maia Filho**

**Prof. Nome do Prof 3**

---

_Curso de Engenharia de Software_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

Esse projeto visa desenvolver uma plataforma online para psicólogos, centralizando todas as funcionalidades essenciais em um só lugar. O sistema permitirá o agendamento de consultas, controle dos pacientes e o registro do estado emocional deles, proporcionando mais organização e eficiência. O objetivo é otimizar a rotina dos profissionais e aprimorar a experiência dos pacientes, eliminando a necessidade de múltiplas ferramentas e garantindo um atendimento mais fluido e integrado.

---


## 1. Introdução

No mundo digital de hoje, até os consultórios de psicologia precisam se modernizar. Muitos profissionais ainda dependem de métodos manuais ou de sistemas desconexos para agendar, gerenciar consultas e acompanhar o bem-estar dos pacientes. Pensando nisso, surge a proposta de desenvolver uma plataforma integrada que reúne todas essas funcionalidades em um só lugar, tornando o dia a dia dos psicólogos muito mais prático.

### 1.1 Contextualização

Nos últimos anos, diversas áreas têm se beneficiado de soluções digitais para otimizar processos, facilitar a gestão de informações e ampliar o acesso a atendimentos e acompanhamento profissional. No entanto, a psicologia ainda enfrenta desafios como a organização de consultas, o controle do histórico dos pacientes e o monitoramento contínuo de suas emoções. Diante desse cenário, a implementação de um sistema integrado de gestão entre psicólogos e pacientes surge como uma solução estratégica, trazendo mais transparência, eficiência e praticidade para o atendimento.

### 1.2 Problema

Atualmente, muitos psicólogos enfrentam desafios significativos na gestão eficiente de suas práticas clínicas, o que pode comprometer a qualidade do atendimento oferecido. Os principais problemas incluem:

- **Gestão ineficaz da agenda:** A ausência de um sistema integrado pode levar a agendamentos confusos, sobreposição de horários e dificuldade na remarcação de sessões, resultando em uma rotina desorganizada e estressante para o profissional.
- **Falta de registro centralizado das informações do paciente:** A utilização de métodos manuais ou sistemas desconexos dificulta o acompanhamento contínuo do histórico e das emoções dos pacientes, tornando o monitoramento da evolução terapêutica menos preciso e eficiente.
- **Comunicação limitada entre sessões:** Sem uma ferramenta que permita o registro contínuo das emoções e eventos diários, muitos aspectos importantes do dia a dia do paciente podem se perder entre as sessões. Isso dificulta que o psicólogo tenha uma visão completa do estado emocional do paciente ao longo do tempo, impactando a personalização do atendimento.
- **Ausência de um acompanhamento visual estruturado:** Sem uma ferramenta intuitiva, os pacientes podem ter dificuldade em perceber padrões emocionais ao longo do tempo.

Esses desafios mostram a importância de soluções tecnológicas que tornem a rotina dos psicólogos mais organizada e eficiente. De acordo com o blog Saúde Vianet, a implementação de softwares de gestão clínica pode centralizar todas as operações em um só lugar, facilitando o agendamento, a comunicação e o registro de informações dos pacientes, além de melhorar a organização financeira e o controle de custos. 

A adoção de plataformas digitais especializadas não apenas otimiza a rotina dos profissionais de psicologia, mas também aprimora a experiência dos pacientes, promovendo um atendimento mais organizado, eficiente e centrado nas necessidades individuais.

- https://saudevianet.com.br/blog/desafios-gestao-de-clinicas-de-psicologia/

### 1.3 Objetivo geral

O objetivo geral deste trabalho é desenvolver um sistema de gestão digital para psicólogos e pacientes, com funcionalidades voltadas para o registro das emoções diárias dos pacientes, o acompanhamento contínuo pelo psicólogo e a organização eficiente da agenda profissional.

#### 1.3.1 Objetivos específicos

	•	Criar um sistema de agendamento simples e intuitivo.
	•	Estabelecer um canal de comunicação entre psicólogos e pacientes.
	•	Implementar um módulo para registro e monitoramento dos sentimentos dos pacientes.
	•	Garantir uma experiência de uso agradável, com foco em acessibilidade e facilidade de uso.
 	•	Oferecer uma gestão eficiente das consultas do consultório, permitindo o controle de horários, histórico e organização das sessões de forma prática e sem erros.

### 1.4 Justificativas

A gestão de práticas psicológicas enfrenta desafios como desorganização da agenda, dificuldades no acompanhamento das emoções dos pacientes e comunicação limitada entre sessões. Esses problemas impactam tanto o profissional quanto o paciente, prejudicando a qualidade do atendimento e a continuidade do tratamento.

Este trabalho se justifica pela crescente demanda por soluções tecnológicas na área da saúde mental, especialmente em psicologia, e pela necessidade de um sistema que facilite o gerenciamento tanto para o profissional quanto para o paciente. Ao criar um sistema digital de gestão, será possível integrar o agendamento, a comunicação e o registro das emoções dos pacientes em uma plataforma única, simplificando o dia a dia do psicólogo e promovendo um atendimento mais organizado e eficiente. Além disso, a plataforma permitirá ao psicólogo otimizar seu tempo, tornando o processo de agendamento e análise de dados mais ágil, promovendo uma experiência mais completa e satisfatória para ambas as partes. O trabalho também destaca a importância da tecnologia como aliada no processo terapêutico, ao tornar os dados mais acessíveis e fáceis de gerenciar.

## 2. Participantes do processo

_Apresente aqui os perfis dos usuários-chave do sistema. Diversas são as informações que podem ser relevantes para a definição dos perfis dos usuários, tais como idade, gênero, aspectos culturais, nível de educação, entre outros. A pesquisa de mercado pode ser uma ferramenta poderosa para se identificar e caracterizar os perfis de usuários. Apresente claramente o papel a ser desempenhado por cada usuário._



## 3. Modelagem do processo de negócio

### 3.1. Análise da situação atual

_Apresente uma descrição textual de como os sistemas atuais resolvem o problema que se propõe a resolver.  Caso sua proposta seja inovadora e não existam processos claramente definidos, **apresente como as tarefas que o seu sistema pretende implementar são executadas atualmente**, mesmo que não se utilize tecnologia computacional._

### 3.2. Descrição geral da proposta de solução

_Apresente aqui uma descrição da sua proposta abordando seus limites e suas ligações com as estratégias e objetivos do negócio. Apresente aqui as oportunidades de melhorias._

### 3.3. Modelagem dos processos

[PROCESSO 1 - Nome do Processo](processo-1-nome-do-processo.md "Detalhamento do Processo 1.")

[PROCESSO 2 - Nome do Processo](processo-2-nome-do-processo.md "Detalhamento do Processo 2.")

[PROCESSO 3 - Nome do Processo](processo-3-nome-do-processo.md "Detalhamento do Processo 3.")

[PROCESSO 4 - Nome do Processo](processo-4-nome-do-processo.md "Detalhamento do Processo 4.")

## 4. Projeto da solução

_O documento a seguir apresenta o detalhamento do projeto da solução. São apresentadas duas seções que descrevem, respectivamente: modelo relacional e tecnologias._

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")


## 5. Indicadores de desempenho

_O documento a seguir apresenta os indicadores de desempenho dos processos._

[Indicadores de desempenho dos processos](performance-indicators.md)


## 6. Interface do sistema

_A sessão a seguir apresenta a descrição do produto de software desenvolvido._ 

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

_Apresente aqui a conclusão do seu trabalho. Deve ser apresentada aqui uma discussão dos resultados obtidos no trabalho, local em que se verifica as observações pessoais de cada aluno. Essa seção poderá também apresentar sugestões de novas linhas de estudo._

# REFERÊNCIAS

_Como um projeto de software não requer revisão bibliográfica, a inclusão das referências não é obrigatória. No entanto, caso você deseje incluir referências relacionadas às tecnologias, padrões, ou metodologias que serão usadas no seu trabalho, relacione-as de acordo com a ABNT._

_Verifique no link abaixo como devem ser as referências no padrão ABNT:_

http://portal.pucminas.br/imagedb/documento/DOC_DSC_NOME_ARQUI20160217102425.pdf

**[1.1]** - _ELMASRI, Ramez; NAVATHE, Sham. **Sistemas de banco de dados**. 7. ed. São Paulo: Pearson, c2019. E-book. ISBN 9788543025001._

**[1.2]** - _COPPIN, Ben. **Inteligência artificial**. Rio de Janeiro, RJ: LTC, c2010. E-book. ISBN 978-85-216-2936-8._

**[1.3]** - _CORMEN, Thomas H. et al. **Algoritmos: teoria e prática**. Rio de Janeiro, RJ: Elsevier, Campus, c2012. xvi, 926 p. ISBN 9788535236996._

**[1.4]** - _SUTHERLAND, Jeffrey Victor. **Scrum: a arte de fazer o dobro do trabalho na metade do tempo**. 2. ed. rev. São Paulo, SP: Leya, 2016. 236, [4] p. ISBN 9788544104514._

**[1.5]** - _RUSSELL, Stuart J.; NORVIG, Peter. **Inteligência artificial**. Rio de Janeiro: Elsevier, c2013. xxi, 988 p. ISBN 9788535237016._



# APÊNDICES


_Atualizar os links e adicionar novos links para que a estrutura do código esteja corretamente documentada._


## Apêndice A - Código fonte

[Código do front-end](../src/front) -- repositório do código do front-end

[Código do back-end](../src/back)  -- repositório do código do back-end


## Apêndice B - Apresentação final


[Slides da apresentação final](presentations/)


[Vídeo da apresentação final](video/)






