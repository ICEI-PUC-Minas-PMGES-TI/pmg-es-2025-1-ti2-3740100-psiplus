package com.psiplus.service;

import com.psiplus.model.DisponibilidadeRecorrente;
import com.psiplus.repository.DisponibilidadeRecorrenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class DisponibilidadeRecorrenteService {

    @Autowired
    private DisponibilidadeRecorrenteRepository repository;

    public DisponibilidadeRecorrente criar(DisponibilidadeRecorrente disponibilidade) {
        validarDisponibilidade(disponibilidade);
        return repository.save(disponibilidade);
    }

    public List<DisponibilidadeRecorrente> listarPorPsicologo(Long psicologoId) {
        return repository.findByPsicologoPsicologoId(psicologoId);
    }

    public void deletarPorPsicologo(Long psicologoId) {
        repository.deleteByPsicologo_PsicologoId(psicologoId);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public Optional<DisponibilidadeRecorrente> buscarPorId(Long id) {
        return repository.findById(id);
    }

    private void validarDisponibilidade(DisponibilidadeRecorrente d) {
        if (d.getHoraFim().isBefore(d.getHoraInicio()) || d.getHoraFim().equals(d.getHoraInicio())) {
            throw new IllegalArgumentException("Horário de fim deve ser posterior ao horário de início.");
        }
    }
}
