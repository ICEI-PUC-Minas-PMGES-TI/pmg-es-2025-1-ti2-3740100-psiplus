package com.psiplus.controller;

import com.psiplus.model.DisponibilidadeRecorrente;
import com.psiplus.repository.DisponibilidadeRecorrenteRepository;
import com.psiplus.service.DisponibilidadeRecorrenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disponibilidades")
public class DisponibilidadeRecorrenteController {

    @Autowired
    private DisponibilidadeRecorrenteService service;

    @GetMapping("/psicologo/{id}")
    public List<DisponibilidadeRecorrente> listarPorPsicologo(@PathVariable Long id) {
        return service.listarPorPsicologo(id);
    }

    @PostMapping
    public DisponibilidadeRecorrente criar(@RequestBody DisponibilidadeRecorrente disponibilidade) {
        return service.criar(disponibilidade);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }

    @DeleteMapping("/recorrentes/{psicologoId}")
    public ResponseEntity<Void> deletarModeloRecorrente(@PathVariable Long psicologoId) {
        service.deletarPorPsicologo(psicologoId);
        return ResponseEntity.noContent().build(); // 204
    }


}

