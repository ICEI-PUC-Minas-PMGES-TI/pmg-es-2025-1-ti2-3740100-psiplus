package com.psiplus.repository;

import com.psiplus.model.CalendarioEmocao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CalendarioEmocaoRepository extends JpaRepository<CalendarioEmocao, Long> {

    @Query("SELECT c FROM CalendarioEmocao c JOIN FETCH c.tipoEmocao WHERE c.paciente.id = :pacienteId")
    List<CalendarioEmocao> findByPacienteIdComTipoEmocao(@Param("pacienteId") Long pacienteId);

    @Query("SELECT c FROM CalendarioEmocao c JOIN FETCH c.tipoEmocao WHERE c.paciente.id = :pacienteId AND c.data = :data")
    List<CalendarioEmocao> findByPacienteIdAndDataComTipoEmocao(@Param("pacienteId") Long pacienteId, @Param("data") LocalDate data);

    @Query("SELECT c FROM CalendarioEmocao c JOIN FETCH c.tipoEmocao WHERE c.paciente.id = :pacienteId AND c.data = :data AND c.hora BETWEEN :start AND :end")
    List<CalendarioEmocao> findByPacienteIdDataHoraComTipoEmocao(@Param("pacienteId") Long pacienteId,
                                                                 @Param("data") LocalDate data,
                                                                 @Param("start") LocalTime start,
                                                                 @Param("end") LocalTime end);
}

