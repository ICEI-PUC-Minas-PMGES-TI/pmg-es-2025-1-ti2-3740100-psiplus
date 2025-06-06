package com.psiplus.repository;

import com.psiplus.model.DisponibilidadeRecorrente;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisponibilidadeRecorrenteRepository extends JpaRepository<DisponibilidadeRecorrente, Long> {
    List<DisponibilidadeRecorrente> findByPsicologoPsicologoId(Long psicologoId);
    @Transactional
    void deleteByPsicologo_PsicologoId(Long psicologoId);

}
