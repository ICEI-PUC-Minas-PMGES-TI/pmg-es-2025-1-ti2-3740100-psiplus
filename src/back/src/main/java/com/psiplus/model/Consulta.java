package com.psiplus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JoinColumn(name = "paciente_Id")
    private Long pacienteId;

    private LocalDate data;

    private LocalTime horario;

    // Getters e Setters
    public Long getId() { return id; }
    public Long getPaciente_Id() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHorario() { return horario; }
    public void setHorario(LocalTime horario) { this.horario = horario; }
}
