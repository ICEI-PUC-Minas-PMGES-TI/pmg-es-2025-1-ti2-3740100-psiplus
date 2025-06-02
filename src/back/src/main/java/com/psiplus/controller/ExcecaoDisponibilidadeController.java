package com.psiplus.controller;

import com.psiplus.model.ExcecaoDisponibilidade;
import com.psiplus.service.ExcecaoDisponibilidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disponibilidades/excecoes")
public class ExcecaoDisponibilidadeController {

    @Autowired
    private ExcecaoDisponibilidadeService service;

    @PostMapping
    public ExcecaoDisponibilidade criar(@RequestBody ExcecaoDisponibilidade excecao) {
        return service.criar(excecao);
    }

    @GetMapping("/psicologo/{id}")
    public List<ExcecaoDisponibilidade> listarPorPsicologo(@PathVariable Long id) {
        return service.listarPorPsicologo(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build(); // 404
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500
        }
    }

}
