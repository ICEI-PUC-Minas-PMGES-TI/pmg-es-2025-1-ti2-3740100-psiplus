package com.psiplus.controller;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import com.psiplus.DTO.PacienteDTO;
import com.psiplus.model.Paciente;
import com.psiplus.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    public List<Paciente> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscar(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paciente);
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

        // Preserva os IDs do usuário e endereço existentes
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
    public ResponseEntity<?> login(@RequestBody com.psiplus.model.LoginRequest request) {
        com.psiplus.model.Paciente paciente = service.autenticar(request.getEmail(), request.getSenha());
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

}
