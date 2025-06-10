package com.psiplus.controller;

import com.psiplus.dto.CalendarioEmocaoDTO;
import com.psiplus.model.CalendarioEmocao;
import com.psiplus.service.CalendarioEmocaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/emocoes")
@CrossOrigin(origins = "*")
public class CalendarioEmocaoController {

    @Autowired
    private CalendarioEmocaoService calendarioEmocaoService;

    @PostMapping
    public CalendarioEmocaoDTO criarEmocao(@RequestBody CalendarioEmocao emocao) {
        CalendarioEmocao salvo = calendarioEmocaoService.salvar(emocao);
        return calendarioEmocaoService.toDTO(salvo);
    }

    @GetMapping
    public List<CalendarioEmocao> listarTodos() {
        return calendarioEmocaoService.listarTodos();
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<CalendarioEmocaoDTO> listarPorPaciente(@PathVariable Long pacienteId) {
        return calendarioEmocaoService.listarPorPacienteId(pacienteId);
    }

    @GetMapping("/paciente/{pacienteId}/data/{data}")
    public List<CalendarioEmocaoDTO> listarPorPacienteEData(@PathVariable Long pacienteId,
                                                            @PathVariable String data) {
        return calendarioEmocaoService.listarPorPacienteEData(pacienteId, LocalDate.parse(data));
    }
}
