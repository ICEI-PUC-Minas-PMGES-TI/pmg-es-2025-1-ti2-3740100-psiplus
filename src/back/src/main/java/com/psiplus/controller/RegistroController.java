package com.psiplus.controller;

import com.psiplus.DTO.AnotacaoDTO;
import com.psiplus.model.Registro;
import com.psiplus.service.RegistroService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registros")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @PostMapping
    public ResponseEntity<?> adicionarRegistro(@RequestBody @Valid AnotacaoDTO dto) {
        Registro registroSalvo = registroService.salvarRegistro(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(registroSalvo);
    }

    @GetMapping("/{pacienteId}")
    public ResponseEntity<List<AnotacaoDTO>> listarRegistrosDoPaciente(@PathVariable Long pacienteId) {
        List<Registro> registros = registroService.listarPorPaciente(pacienteId);

        // Converte cada Registro em AnotacaoDTO
        List<AnotacaoDTO> dtos = registros.stream().map(registro -> {
            AnotacaoDTO dto = new AnotacaoDTO();
            dto.setPacienteId(registro.getPaciente().getPacienteId()); // Atenção aqui
            dto.setData(registro.getData());
            dto.setHora(registro.getHora());
            dto.setConteudo(registro.getAnotacao());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }
}
