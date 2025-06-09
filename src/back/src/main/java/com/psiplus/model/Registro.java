package com.psiplus.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "registros")
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registro_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(name = "data_registro", nullable = false)
    private LocalDate data;

    @Column(name = "hora_registro", nullable = false)
    private LocalTime hora;

    @Column(name = "anotacao", columnDefinition = "TEXT", nullable = false)
    private String anotacao;

    // Getters e Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Paciente getPaciente() { return paciente; }

    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public LocalDate getData() { return data; }

    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHora() { return hora; }

    public void setHora(LocalTime hora) { this.hora = hora; }

    public String getAnotacao() { return anotacao; }

    public void setAnotacao(String anotacao) { this.anotacao = anotacao; }
}
