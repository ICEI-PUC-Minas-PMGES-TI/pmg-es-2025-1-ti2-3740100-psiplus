package com.psiplus.repository;

import com.psiplus.model.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    List<Consulta> findByPacienteId(Long pacienteId);
    List<Consulta> findByPsicologoId(Long psicologoId);
    List<Consulta> findByPsicologoIdAndData(Long psicologoId, LocalDate data);
    Optional<Consulta> findTopByPacienteIdOrderByDataDescHorarioInicioDesc(Long pacienteId);
}

