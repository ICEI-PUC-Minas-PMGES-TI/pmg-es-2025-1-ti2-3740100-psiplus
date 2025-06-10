package com.psiplus.repository;

import com.psiplus.model.CalendarioEmocao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CalendarioEmocaoRepository extends JpaRepository<CalendarioEmocao, Long> {

    List<CalendarioEmocao> findByPaciente_PacienteId(Long pacienteId);

    List<CalendarioEmocao> findByPaciente_PacienteIdAndData(Long pacienteId, LocalDate data);

    List<CalendarioEmocao> findByPaciente_PacienteIdAndDataAndHoraBetween(Long pacienteId, LocalDate data, LocalTime start, LocalTime end);

}
