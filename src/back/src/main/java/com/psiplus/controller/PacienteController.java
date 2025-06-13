package com.psiplus.controller;
import java.util.HashMap;
import java.util.Map;

import com.psiplus.DTO.PacienteComPsicologoDTO;
import com.psiplus.DTO.PacienteDTO;
import com.psiplus.DTO.RedefinicaoSenhaDTO;
import com.psiplus.model.Paciente;
import com.psiplus.model.LoginRequest;
import com.psiplus.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    public List<PacienteDTO> listar(@RequestParam(required = false) String nome) {
        return nome != null ? service.buscarPorNome(nome) : service.listarResumo();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscar(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/{id}/com-psicologo")
    public ResponseEntity<PacienteComPsicologoDTO> buscarComPsicologo(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PacienteComPsicologoDTO(paciente));
    }


    @PostMapping
    public ResponseEntity<Paciente> salvar(@RequestBody Paciente paciente) {
        Paciente salvo = service.salvar(paciente);
        URI uri = URI.create(String.format("/pacientes/%s", salvo.getPacienteId()));
        return ResponseEntity.created(uri).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> atualizar(@PathVariable Long id, @RequestBody Paciente pacienteAtualizado) {
        Paciente existente = service.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        if (existente.getUsuario() != null) {
            pacienteAtualizado.getUsuario().setUsuarioId(existente.getUsuario().getUsuarioId());
            if (existente.getUsuario().getEndereco() != null) {
                pacienteAtualizado.getUsuario().getEndereco().setId(existente.getUsuario().getEndereco().getId());
            }
        }
        pacienteAtualizado.setPacienteId(id);
        Paciente salvo = service.salvar(pacienteAtualizado);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping("/resumo")
    public List<PacienteDTO> listarResumo() {
        return service.listarResumo();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Paciente paciente = service.autenticar(request.getEmail(), request.getSenha());
        System.out.println(paciente);
        System.out.println(request.getEmail());
        System.out.println(request.getSenha());
        if (paciente == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Email ou senha inválidos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
        }
        return ResponseEntity.ok(paciente);
    }

    @PutMapping("/{id}/historico-clinico")
    public ResponseEntity<?> atualizarHistoricoClinico(@PathVariable Long id, @RequestBody String anotacoes) {
        boolean atualizado = service.atualizarHistoricoClinico(id, anotacoes);
        if (!atualizado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinicaoSenhaDTO dto) {
        boolean sucesso = service.redefinirSenha(dto.getEmail(), dto.getSenhaAntiga(), dto.getNovaSenha(), dto.getConfirmarSenha());
        if (sucesso) {
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Senha antiga incorreta ou paciente não encontrado.");
        }
    }
}