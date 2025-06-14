package com.psiplus.controller;

import com.psiplus.DTO.ContagemEmocaoDTO;
import com.psiplus.DTO.EventoEmocaoDTO;
import com.psiplus.repository.CalendarioEmocaoRepository;
import com.psiplus.model.CalendarioEmocao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EmocaoController {

    @Autowired
    private CalendarioEmocaoRepository calendarioRepo;

    @GetMapping("/teste")
    public String teste() {
        return "API funcionando!";
    }

    @GetMapping("/emocoes")
    public List<ContagemEmocaoDTO> listarPorPeriodo(
            @RequestParam String periodo,
            @RequestParam Long pacienteId
    ) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataInicio;
        LocalDate dataFim;

        switch (periodo.toLowerCase()) {
            case "dia":
                dataInicio = hoje;
                dataFim = hoje;
                break;
            case "semana":
                dataInicio = hoje.with(java.time.DayOfWeek.MONDAY);
                dataFim = dataInicio.plusDays(6); // pega até domingo
                break;
            case "mes":
                dataInicio = hoje.withDayOfMonth(1);
                dataFim = dataInicio.withDayOfMonth(dataInicio.lengthOfMonth());
                break;
            default:
                throw new IllegalArgumentException("Período inválido: use 'dia', 'semana' ou 'mes'");
        }

        return calendarioRepo.contarPorPeriodo(pacienteId, dataInicio, dataFim);
    }

    @GetMapping("/emocoes/eventos")
    public List<EventoEmocaoDTO> listarEventosPorPeriodo(
            @RequestParam String periodo,
            @RequestParam Long pacienteId
    ) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataInicio;
        LocalDate dataFim;

        switch (periodo.toLowerCase()) {
            case "dia":
                dataInicio = hoje;
                dataFim = hoje;
                break;
            case "semana":
                dataInicio = hoje.with(java.time.DayOfWeek.MONDAY);
                dataFim = dataInicio.plusDays(6);  // Final da semana (domingo)
                break;
            case "mes":
                dataInicio = hoje.withDayOfMonth(1);
                dataFim = dataInicio.withDayOfMonth(dataInicio.lengthOfMonth()); // Último dia do mês
                break;
            default:
                throw new IllegalArgumentException("Período inválido: use 'dia', 'semana' ou 'mes'");
        }

        LocalTime horaInicio = LocalTime.MIN; // 00:00:00
        LocalTime horaFim = LocalTime.MAX;    // 23:59:59.999999999

        List<CalendarioEmocao> eventos = calendarioRepo.buscarEventosComTipoEmocaoPorPeriodo(
                pacienteId,
                dataInicio,
                dataFim
        );

        return eventos.stream()
                .map(e -> new EventoEmocaoDTO(
                        e.getTipoEmocao().getNome(),
                        e.getData(),
                        e.getHora(),
                        e.getSentimento(),
                        e.getNotas()
                ))
                .collect(Collectors.toList());
    }
}
