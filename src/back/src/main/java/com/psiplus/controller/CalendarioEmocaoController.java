package com.psiplus.controller;

import com.psiplus.DTO.CalendarioEmocaoDTO;
import com.psiplus.repository.PacienteRepository;
import com.psiplus.repository.TipoEmocaoRepository;
import com.psiplus.util.EmocaoDuplicadaException;
import com.psiplus.util.EntidadeNaoEncontradaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

import com.psiplus.service.CalendarioEmocaoService;


@RestController
@RequestMapping("/api/emocoes")
public class CalendarioEmocaoController {

    @Autowired
    private CalendarioEmocaoService calendarioEmocaoService;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private TipoEmocaoRepository tipoEmocaoRepository;

    @PostMapping
    public ResponseEntity<?> criarEmocao(@RequestBody CalendarioEmocaoDTO dto) {
        try {
            CalendarioEmocaoDTO salvo = calendarioEmocaoService.criarEmocao(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (EmocaoDuplicadaException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (EntidadeNaoEncontradaException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado: " + e.getMessage());
        }
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
