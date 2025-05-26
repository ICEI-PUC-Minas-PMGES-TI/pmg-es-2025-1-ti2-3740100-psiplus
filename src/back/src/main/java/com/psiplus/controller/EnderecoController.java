package com.psiplus.controller;

import com.psiplus.model.Endereco;
import com.psiplus.service.EnderecoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

    @Autowired
    private EnderecoService service;

    @GetMapping
    public List<Endereco> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Endereco buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Endereco salvar(@RequestBody Endereco endereco) {
        return service.salvar(endereco);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
