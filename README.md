# PsiPlus

<p align="center">
   <img src="docs/images/logo.png" alt="Logo PsiPlus" width="500">
</p>

### **Conectando emoções, organizando cuidados.**

A gestão de práticas psicológicas enfrenta desafios como desorganização da agenda, dificuldade no acompanhamento emocional dos pacientes e comunicação limitada entre sessões. Este trabalho propõe a criação de um sistema digital que integre agendamento, comunicação e registro emocional, facilitando o trabalho do psicólogo e melhorando a experiência do paciente. A plataforma tornará o atendimento mais eficiente, organizado e com dados mais acessíveis.

## 👥 Integrantes

* Ana Luiza de Freitas Rodrigues
* Carlos Eduardo Sousa Santos
* Júlia de Souza Ventura
* Kayke Emanoel de Souza Santos
* Rafael Rocha Caldeira Brant

## 👨‍🏫 Professor

* Michelle Hanne Soares de Andrade
* Danilo de Quadra Maia Filho
* Joana Gabriela Ribeiro de Souza

## 📌 Instruções de utilização

### Requisitos

- Node.js (versão 16 ou superior) instalado para executar o front-end React.  
- Java JDK 17 (ou superior) instalado para executar o back-end Spring Boot.  
- Maven instalado para gerenciar as dependências do back-end.  
- Conta e configurações no Azure para acesso ao banco de dados.

### Instalação e Configuração

1. **Clone o repositório do projeto**  
   ```bash
   git clone https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2025-1-ti2-3740100-psiplus.git
   cd psiplus
   ```

2. **Configurar o banco de dados Azure**  
   - Crie uma instância do Azure SQL Database.  
   - Configure as credenciais de acesso e anote a string de conexão.

3. **Configurar o back-end (Spring Boot)**  
   - No diretório do back-end, configure o arquivo `application.properties` ou `application.yml` com a string de conexão do Azure SQL Database e outras variáveis necessárias.  
   - Instale as dependências e execute a aplicação:  
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Configurar o front-end (React)**  
   - No diretório do front-end, instale as dependências:  
   ```bash
   npm install
   ```  
   - Execute a aplicação:  
   ```bash
   npm start
   ```  
   - Acesse o sistema no navegador através do endereço: `http://localhost:3000`

### Observações

- Certifique-se de que o back-end esteja rodando antes de iniciar o front-end para garantir a comunicação entre as partes.  
- Para produção, recomenda-se configurar variáveis de ambiente e realizar o build da aplicação front-end com:  
  ```bash
  npm run build
  ```


## 🚀 Histórico de versões

* 0.1.1
    * CHANGE: Atualização das documentações. Código permaneceu inalterado.
* 0.1.0
    * Implementação da funcionalidade X pertencente ao processo P.
* 0.0.1
    * Trabalhando na modelagem do processo de negócio.

