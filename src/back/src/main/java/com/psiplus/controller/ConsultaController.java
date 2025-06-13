package com.psiplus.controller;

import com.psiplus.DTO.AgendamentoDTO;
import com.psiplus.DTO.ConsultaDTO;
import com.psiplus.DTO.HorarioDisponivelDTO;
import com.psiplus.model.Consulta;
import com.psiplus.service.ConsultaService;
import com.psiplus.service.DisponibilidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;
    @Autowired
    private DisponibilidadeService disponibilidadeService;

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

    @PutMapping("/reagendar/{id}")
    public ResponseEntity<Consulta> reagendarConsulta(
            @PathVariable Long id,
            @RequestBody AgendamentoDTO dto) {
        Consulta consultaAtualizada = consultaService.reagendarConsulta(id, dto);
        return ResponseEntity.ok(consultaAtualizada);
    }

    @GetMapping("/horarios-disponiveis")
    public ResponseEntity<List<HorarioDisponivelDTO>> getHorariosDisponiveis(
            @RequestParam Long psicologoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {

        List<HorarioDisponivelDTO> horarios = disponibilidadeService.buscarHorariosDisponiveis(psicologoId, data);
        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/disponibilidade-mensal")
    public ResponseEntity<Map<LocalDate, List<HorarioDisponivelDTO>>> getDisponibilidadeMensal(
            @RequestParam Long pacienteId) {

        Map<LocalDate, List<HorarioDisponivelDTO>> mapaDisponibilidade = disponibilidadeService.buscarDisponibilidadeMensal(pacienteId);
        return ResponseEntity.ok(mapaDisponibilidade);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaDTO> buscarConsultaComDetalhes(@PathVariable Long id) {
        ConsultaDTO dto = consultaService.buscarConsultaDetalhada(id);
        return ResponseEntity.ok(dto);
    }

}
