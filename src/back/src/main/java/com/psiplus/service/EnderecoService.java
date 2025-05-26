package com.psiplus.service;

import com.psiplus.model.Endereco;
import com.psiplus.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository repository;

    public List<Endereco> listarTodos() {
        return repository.findAll();
    }

    public Endereco buscarPorId(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Endereco salvar(Endereco endereco) {
        return repository.save(endereco);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
