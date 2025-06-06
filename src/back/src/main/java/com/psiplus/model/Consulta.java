package com.psiplus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "psicologo_id", nullable = false)
    private Long psicologoId;

    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "horario_inicio", nullable = false)
    private LocalTime horarioInicio;

    @Column(name = "horario_fim", nullable = false)
    private LocalTime horarioFim;

    // Getters e Setters
    public Long getId() { return id; }

    public LocalDateTime getDataHoraInicio() {
        return LocalDateTime.of(data, horarioInicio);
    }

    public LocalDateTime getDataHoraFim() {
        return LocalDateTime.of(data, horarioFim);
    }


    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public Long getPsicologoId() { return psicologoId; }
    public void setPsicologoId(Long psicologoId) { this.psicologoId = psicologoId; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }
}
