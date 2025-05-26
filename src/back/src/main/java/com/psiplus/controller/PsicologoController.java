package com.psiplus.controller;

import com.psiplus.model.Psicologo;
import com.psiplus.service.PsicologoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Psicologo buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Psicologo salvar(@RequestBody Psicologo psicologo) {
        return service.salvar(psicologo);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
