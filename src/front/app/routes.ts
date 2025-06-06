import {
    type RouteConfig,
    index,
    route,
  } from "@react-router/dev/routes";

  export default [
    index("routes/inicioRoute.tsx"),
    route("paciente/login", "routes/paciente/loginPacienteRoute.tsx"),
    route("paciente/redefinirSenha", "routes/paciente/redefinicaoSenhaRoute.tsx"),
    route("paciente/agenda", "routes/paciente/agendaPacienteRoute.tsx"),
    route("psicologo/login", "routes/psicologo/loginPsicologoRoute.tsx"),
    route("psicologo/cadastro", "routes/psicologo/cadastroPsicologoRoute.tsx"),
    route("psicologo/pacientes/", "routes/dashboardRoute.tsx"),
    route("psicologo/pacientes/:id", "routes/psicologo/gestaoPacientesRoute.tsx"),
    route("psicologo/cadastroPacientes", "routes/psicologo/cadastroPacientesRoute.tsx"),
    route("psicologo/gestaoRegistros/:id", "routes/psicologo/gestaoRegistrosRoute.tsx"),
    route("psicologo/registroAnotacoes", "routes/psicologo/registroAnotacoesRoute.tsx"),
    route("psicologo/agenda", "routes/psicologo/paginaPrincipalRoute.tsx"),
    route("psicologo/agenda/editar", "routes/psicologo/editarAgendaRoute.tsx"),
    route("psicologo/agendarConsulta", "routes/psicologo/agendarConsultaRoute.tsx"),
    route("psicologo/calendarioEmocoes", "routes/psicologo/calendarioEmocoesRoute.tsx"),


    // 404
    route("*", "routes/Erro404Route.tsx"),
  ] satisfies RouteConfig;
