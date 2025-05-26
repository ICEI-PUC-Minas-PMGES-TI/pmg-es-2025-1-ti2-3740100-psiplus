package com.psiplus.service;

import com.psiplus.model.Psicologo;
import com.psiplus.repository.PsicologoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PsicologoService {

    @Autowired
    private PsicologoRepository repository;

    public List<Psicologo> listarTodos() {
        return repository.findAll();
    }

    public Psicologo buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Psicologo salvar(Psicologo psicologo) {
        return repository.save(psicologo);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
