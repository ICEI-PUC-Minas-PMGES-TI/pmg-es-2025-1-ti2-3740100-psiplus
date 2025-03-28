### 3.3.2 Processo 2 – Cadastro e Gestão do paciente

**Cadastro e Gestão do paciente:** A gestão de pacientes e históricos clínicos em clínicas de psicologia enfrenta desafios como registros descentralizados, dificuldades de acesso às informações e processos manuais suscetíveis a erros. A digitalização completa do processo permite maior organização, reduz burocracias e melhora a continuidade do tratamento. Um sistema centralizado e automatizado possibilita um cadastro mais eficiente, facilitando atualizações e acesso rápido ao histórico clínico. 

![Exemplo de um Modelo BPMN do Cadastro e Gestão do paciente](images/Modelagem-CadastroeGestãodosPacientess.png)


#### Detalhamento das atividades

**Pesquisa de Perfil do paciente**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ----           | ---               |
| Nome            | Caixa de texto   | Obrigatório    | -                 |
| CPF          | Caixa de Texto   | Formato: 000.000.000-00 | -          |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Pesquisar              | Confirma a pesquisa e exibe os resultados correspondentes             | default           |
| Cancelar            | Descarta a pesquisa e retorna à tela inicial  | Cancel                  |


**Cadastro de paciente**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ----           | ---               |
| Nome            | Caixa de texto   | Obrigatório    | -                 |
| Data de Nascimento  | Data                 | Obrigatório (dd-mm-aaaa)               | -                  |
| Telefone           | Número   | Obrigatório, formato (XX) XXXXX-XXXX | -               |
| Gênero           | Seleção única   | Masculino/Feminino/Outro | -               |
| CPF          | Caixa de Texto   | Formato: 000.000.000-00 | -          |
| E-mail          | Caixa de Texto   | Formato de e-mail válido | -          |
| Endereço           | Área de Texto   | Opcional | -               |
| Observações          | Área de Texto   | Opcional | -          |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Salvar               | Confirma o cadastro e armazena os dados              | default           |
| Cancelar            | Descarta a ação e retorna à tela inicial  | Cancel                  |


**Atualização de Dados do Paciente**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ----           | ---               |
| Nome            | Caixa de texto   | Editável    | -                 |
| Data de Nascimento  | Data                 | Editável (dd-mm-aaaa)               | -                  |
| Gênero           | Seleção única   | Masculino/Feminino/Outro | -               |
| Telefone           | Número   | Editável, formato (XX) XXXXX-XXXX | -               |
| E-mail          | Caixa de Texto   | Formato de e-mail válido | -          |
| Endereço           | Área de Texto   | Opcional | -               |
| Observações          | Área de Texto   | Opcional | -          |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Atualizar               | Confirma as alterações              | default           |
| Cancelar            | Descarta mudanças  | cancel                  |

**Consulta ao Histórico Clínico**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ----           | ---               |
| Data da Consulta            | Data   | Obrigatório    | -                 |
| Anotações  | Área de Texto                 | Somente leitura               | -                  |
| Diagnóstico           | Área de Texto   | Somente leitura | -               |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Visualizar               | Exibe o histórico do paciente              | default           |
| Fechar            | Sai da tela sem alterar dados  | cancel                  |

**Arquivamento de Paciente**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ----           | ---               |
| Status do Paciente   | Seleção Única   | Ativo / Arquivado   | Ativo                |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Arquivar               | Altera o status para "Arquivado"              | default           |
| Cancelar            | Mantém o status atual  | cancel                  |

