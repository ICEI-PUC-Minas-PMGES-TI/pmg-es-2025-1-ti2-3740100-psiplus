### 3.3.1 Processo 1 – Cadastro da agenda
O processo de agendamento no Psi+ permite que psicólogos cadastrem horários como disponíveis, indisponíveis ou cadastrar um paciente à ele. O processo se inicia com a visualização da agenda de acordo com atualizações passadas, onde o paciente selecionará um horário e o definirá da forma que preferir, e, ao final do processo, a agenda estará atualizada.


![Modelo BPMN agendamento](images/Cadastro-da-Agenda-Diagram.png)

![image](https://github.com/user-attachments/assets/3f790060-b57a-4ac1-af62-78414a39f557)
![image](https://github.com/user-attachments/assets/15cffe71-542e-4424-bdab-7f0e5343c26d)



**Visualizar Agenda, Definir tempo do expediente, Definir horário de almoço, Definir tempo entre sessões, Definir tempo de consulta**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| [Nome do campo] | [tipo de dados]  |                |                   |
| tempoExpediente       | Hora      |hh:mm|                   |
| horarioAlmoco       | Hora      |hh:mm|                   |
| tempoEntreSessoes       | Hora      |hh:mm|00:10        |
| duracaoConsulta       | Hora      |hh:mm|01:00        |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| novoPaciente                | Enviar para Processo Cadastar Paciente| ---               |
| novaConsulta                | Enviar para Processo Cadastar Consulta| ---               |


**Selecionar Data e Horario, Pesquisar paciente, Cadastrar paciente, Selecionar paciente, Definir como horário disponível, Definir como horário indisponível**
| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| [Nome do campo] | [tipo de dados]  |                |                   |
| dataehora       | Data e Hora      |dd-mm-aaaa, hh:mm|                   |
| definirComoIndisponivelOuDisponivel       | Seleção unica      ||                   |
| selecionarPaciente       | Seleção unica      ||                   |


| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| criarPaciente       | Enviar para processo de criar paciente      ||                   |
| salvar | Horário é atualizado | default|
| cancelar| Processo é cancelado |cancel|


**Visualizar Agenda atualizada**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| [Nome do campo] | [tipo de dados]  |                |                   |
| tempoExpediente       | Hora      |hh:mm|                   |
| horarioAlmoco       | Hora      |hh:mm|                   |
| tempoEntreSessoes       | Hora      |hh:mm|                   |
| duracaoConsulta       | Hora      |hh:mm|                   |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| novoPaciente                | Enviar para Processo Cadastar Paciente| ---               |
| novaConsulta                | Enviar para Processo Cadastar Consulta| ---               |
