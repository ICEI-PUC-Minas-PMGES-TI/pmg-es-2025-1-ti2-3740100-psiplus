package com.psiplus.service;

import com.psiplus.model.ExcecaoDisponibilidade;
import com.psiplus.repository.ExcecaoDisponibilidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExcecaoDisponibilidadeService {

    @Autowired
    private ExcecaoDisponibilidadeRepository repository;

    public ExcecaoDisponibilidade criar(ExcecaoDisponibilidade excecao) {
        validarExcecao(excecao);
        return repository.save(excecao);
    }

    public List<ExcecaoDisponibilidade> listarPorPsicologo(Long psicologoId) {
        return repository.findByPsicologoPsicologoId(psicologoId);
    }

    public void deletar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exceção não encontrada");
        }

        repository.deleteById(id);
    }


    private void validarExcecao(ExcecaoDisponibilidade e) {
        if (e.getDataHoraFim().isBefore(e.getDataHoraInicio()) || e.getDataHoraFim().equals(e.getDataHoraInicio())) {
            throw new IllegalArgumentException("Data/hora final deve ser posterior à inicial.");
        }
    }
}
