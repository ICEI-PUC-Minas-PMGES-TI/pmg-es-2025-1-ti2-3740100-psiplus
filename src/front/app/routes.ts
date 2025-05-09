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
      route("psicologo/gestaoPacientes", "routes/psicologo/gestaoPacientesRoute.tsx"),
    route("psicologo/agenda", "routes/psicologo/agendaRoute.tsx"),
    // 404
    route("*", "routes/Erro404Route.tsx"),
  ] satisfies RouteConfig;
