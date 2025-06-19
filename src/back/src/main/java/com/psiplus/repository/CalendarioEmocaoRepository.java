package com.psiplus.repository;

import com.psiplus.model.CalendarioEmocao;
import com.psiplus.DTO.ContagemEmocaoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Query("""
    SELECT new com.psiplus.DTO.ContagemEmocaoDTO(te.nome, COUNT(ce))
    FROM CalendarioEmocao ce
    JOIN ce.tipoEmocao te
    WHERE ce.paciente.id = :pacienteId
    AND ce.data BETWEEN :dataInicio AND :dataFim
    GROUP BY te.nome
    """)
    List<ContagemEmocaoDTO> contarPorPeriodo(
            @Param("pacienteId") Long pacienteId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );


    @Query("""
    SELECT c FROM CalendarioEmocao c 
    JOIN FETCH c.tipoEmocao 
    WHERE c.paciente.id = :pacienteId 
    AND c.data >= :inicioDoDia 
    AND c.data < :fimDoDia
    """)
    List<CalendarioEmocao> buscarEventosPorDia(
            @Param("pacienteId") Long pacienteId,
            @Param("inicioDoDia") LocalDateTime inicioDoDia,
            @Param("fimDoDia") LocalDateTime fimDoDia
    );

    @Query("""
    SELECT c FROM CalendarioEmocao c
    JOIN FETCH c.tipoEmocao
    WHERE c.paciente.id = :pacienteId
    AND c.data BETWEEN :dataInicio AND :dataFim
    """)
    List<CalendarioEmocao> findByPacienteIdAndDataBetween(
            @Param("pacienteId") Long pacienteId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    @Query("""
SELECT c FROM CalendarioEmocao c
JOIN FETCH c.tipoEmocao
WHERE c.paciente.id = :pacienteId
AND c.data BETWEEN :dataInicio AND :dataFim
""")
    List<CalendarioEmocao> buscarEventosComTipoEmocaoPorPeriodo(
            @Param("pacienteId") Long pacienteId,
            @Param("dataInicio") LocalDate dataInicio,
            @Param("dataFim") LocalDate dataFim
    );

    Optional<CalendarioEmocao> findByPaciente_PacienteIdAndDataAndHora(Long pacienteId, LocalDate data, LocalTime hora);

    boolean existsByPaciente_PacienteIdAndDataAndHora(Long pacienteId, LocalDate data, LocalTime hora);

    List<CalendarioEmocao> findByPacienteIdAndDataBetweenComTipoEmocao(Long pacienteId, LocalDate dataInicio, LocalDate dataFim);

}