package com.psiplus.controller;

import com.psiplus.dto.ContagemEmocaoDTO;
import com.psiplus.repository.CalendarioEmocaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDate;

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
        LocalDate dataInicio;
        LocalDate dataFim = LocalDate.now();

        switch (periodo.toLowerCase()) {
            case "dia":
                dataInicio = dataFim;
                break;
            case "semana":
                // Segunda-feira da semana atual
                dataInicio = dataFim.with(java.time.DayOfWeek.MONDAY);
                break;
            case "mes":
                // Primeiro dia do mês atual
                dataInicio = dataFim.withDayOfMonth(1);
                break;
            default:
                throw new IllegalArgumentException("Período inválido: use 'dia', 'semana' ou 'mes'");
        }

        return calendarioRepo.contarPorPeriodo(pacienteId, dataInicio, dataFim);
    }
}
