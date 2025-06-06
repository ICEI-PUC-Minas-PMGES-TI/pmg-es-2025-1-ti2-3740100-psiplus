package com.psiplus.controller;

import com.psiplus.DTO.AgendamentoDTO;
import com.psiplus.model.Consulta;
import com.psiplus.repository.ConsultaRepository;
import com.psiplus.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/agendar")
    public Consulta agendarConsulta(@RequestBody AgendamentoDTO dto) {
        return consultaService.agendarConsulta(dto);
    }

    @GetMapping("/paciente/{id}")
    public List<Consulta> buscarPorPaciente(@PathVariable Long id) {
        return consultaService.listarPorPaciente(id);
    }

    @GetMapping("/psicologo/{id}")
    public List<Consulta> buscarPorPsicologo(@PathVariable Long id) {
        return consultaService.listarPorPsicologo(id);
    }
}
