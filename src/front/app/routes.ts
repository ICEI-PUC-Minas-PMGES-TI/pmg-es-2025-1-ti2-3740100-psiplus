import {
    type RouteConfig,
    index,
    route,
  } from "@react-router/dev/routes";

  export default [
    index("routes/inicioRoute.tsx"),
    route("psicologo/login", "routes/psicologo/loginPsicologoRoute.tsx"),
    route("psicologo/cadastro", "routes/psicologo/cadastroPsicologoRoute.tsx"),
    route("dashboard", "routes/dashboardRoute.tsx"),
    route("psicologo/gestaoPacientes/:id", "routes/psicologo/gestaoPacientesRoute.tsx"),
    route("psicologo/agenda", "routes/psicologo/agendaRoute.tsx"),
    route("psicologo/cadastroPacientes", "routes/psicologo/cadastroPacientesRoute.tsx"),
    route("psicologo/gestaoRegistros", "routes/psicologo/gestaoRegistrosRoute.tsx"),
    route("psicologo/registroAnotacoes", "routes/psicologo/registroAnotacoesRoute.tsx"),
    route("psicologo/paginaPrincipal", "routes/psicologo/paginaPrincipalRoute.tsx"),
    route("psicologo/agendarConsulta", "routes/psicologo/agendarConsultaRoute.tsx"),
    // 404
    route("*", "routes/Erro404Route.tsx"),
  ] satisfies RouteConfig;
