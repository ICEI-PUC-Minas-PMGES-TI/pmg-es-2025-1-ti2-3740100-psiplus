package com.psiplus.controller;

import com.psiplus.model.LoginRequest;
import com.psiplus.model.Psicologo;
import com.psiplus.service.PsicologoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/psicologos")
public class PsicologoController {

    @Autowired
    private PsicologoService service;

    @GetMapping
    public List<Psicologo> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Psicologo> buscar(@PathVariable Long id) {
        Psicologo psicologo = service.buscarPorId(id);
        if (psicologo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(psicologo);
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Psicologo psicologo) {
        try {
            Psicologo salvo = service.salvar(psicologo);
            URI uri = URI.create(String.format("/psicologos/%s", salvo.getPsicologoId()));
            return ResponseEntity.created(uri).body(salvo);
        } catch (ResponseStatusException e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(erro);
        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Erro ao salvar psicólogo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(erro);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Psicologo psicologo = service.buscarPorId(id);
        if (psicologo == null) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Psicologo psicologo = service.autenticar(request.getEmail(), request.getSenha());
        if (psicologo == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Email ou senha inválidos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
        }
        return ResponseEntity.ok(psicologo);
    }
}
