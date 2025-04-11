### 3.3.5 Processo 5 – Gestão do Registro de Anotações da Consulta

O processo permite que os profissionais consultem registros, informações importantes sobre as consultas realizadas. O sistema garante a organização eficiente dos registros, facilitando o acompanhamento do histórico do paciente.  

![Exemplo de um Modelo BPMN do PROCESSO 5](images/bpmnGestaoRegistroConsultas.png)  

![Wireframe](images/wireframe-1-gestaoRegistros.png)


## Detalhamento das atividades  


### **Pesquisar**  

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| --- | --- | --- | --- |
| Pesquisar | Área de texto | obrigatório | - |

| **Comandos** | **Destino** | **Tipo** |
| --- | --- | --- |
| Exbir anotação  | Exibir anotações do paciente | Área de texto  |
---

### **Selecionar um dos resultados exibidos**  

| **Comandos** | **Destino** | **Tipo** |
| --- | --- | --- |
| Selecionar | Gráficos e anotações | Tabela |


### **Adicionar anotações**  

| **Comandos** | **Destino** | **Tipo** |
| --- | --- | --- |
| Adicionar anotações | Registrar anotação  | - |
