package com.psiplus.controller;

import com.psiplus.model.ExcecaoDisponibilidade;
import com.psiplus.service.ExcecaoDisponibilidadeService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
