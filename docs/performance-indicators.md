## 5. Indicadores de desempenho

_Apresente aqui os principais indicadores de desempenho e algumas metas para o processo. Atenção: as informações necessárias para gerar os indicadores devem estar contempladas no modelo relacional. Defina no mínimo 3 indicadores de desempenho._

_Usar o seguinte modelo:_

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| ---           | ---           | ---           | ---                | ---                    |
| Envio de e-mail com login/senha | Garantir acesso ao sistema | Verifica se o e-mail de boas-vindas foi enviado após o cadastro | Tabela Usuário | (Pacientes com e-mail enviado / Novos pacientes cadastrados) × 100 |
| Registros de emoções por paciente | Monitorar o engajamento emocional | Mede o uso do recurso de monitoramento de emoções | Tabela Emocoes, Paciente | Contagem de Emoções / Paciente |
| Número médio de anotações por consulta | Avaliar detalhamento do prontuário | Mede a quantidade média de anotações registradas por consulta | Tabela Anotacoes, Consulta | Total de Anotações / Total de Consultas |
| Número de Consultas Mensais | Acompanhar volume de atendimentos mensais | Mede quantas consultas foram realizadas em cada mês | Tabela Consulta | Número de pacientes onde MÊS(DataCadastro) = mês analisado |
| Quantidade de Pacientes Mensal | Acompanhar o crescimento do número de pacientes | Mede quantos pacientes foram cadastrados (ou atendidos) em cada mês | Tabelas Paciente, Usuario, Consulta | Número de pacientes distintos com consultas realizadas no mês analisado |


