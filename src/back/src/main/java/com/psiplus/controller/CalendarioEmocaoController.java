package com.psiplus.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

// Importa suas classes do projeto:
import com.psiplus.model.CalendarioEmocao;
import com.psiplus.dto.CalendarioEmocaoDTO;
import com.psiplus.service.CalendarioEmocaoService;
import com.psiplus.dto.ContagemEmocaoDTO;
import com.psiplus.repository.CalendarioEmocaoRepository;


@RestController
@RequestMapping("/api/emocoes")
@CrossOrigin(origins = "http://localhost:8080", allowCredentials = "true")
public class CalendarioEmocaoController {

    @Autowired
    private CalendarioEmocaoService calendarioEmocaoService;

    @PostMapping
    public CalendarioEmocaoDTO criarEmocao(@RequestBody CalendarioEmocao emocao) {
        CalendarioEmocao salvo = calendarioEmocaoService.salvar(emocao);
        return calendarioEmocaoService.toDTO(salvo);
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
