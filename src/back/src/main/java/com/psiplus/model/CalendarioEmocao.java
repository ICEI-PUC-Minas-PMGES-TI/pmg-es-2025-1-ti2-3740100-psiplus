package com.psiplus.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;
import java.time.LocalTime;

import com.psiplus.model.Paciente;
import com.psiplus.model.TipoEmocao;

@Entity
@Table(name = "calendario_emocoes")
public class CalendarioEmocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendario_emocao_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "tipo_emocao_id", nullable = false)
    private TipoEmocao tipoEmocao;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(columnDefinition = "TEXT")
    private String sentimento;

    @Column(columnDefinition = "TEXT")
    private String notas;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public TipoEmocao getTipoEmocao() {
        return tipoEmocao;
    }

    public void setTipoEmocao(TipoEmocao tipoEmocao) {
        this.tipoEmocao = tipoEmocao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getSentimento() {
        return sentimento;
    }

    public void setSentimento(String sentimento) {
        this.sentimento = sentimento;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}
