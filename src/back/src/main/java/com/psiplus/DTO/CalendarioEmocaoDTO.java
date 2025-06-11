package com.psiplus.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public class CalendarioEmocaoDTO {

    private Long id;
    private Long pacienteId;
    private Long tipoEmocaoId;
    private String tipoEmocaoNome;
    private LocalDate data;
    private LocalTime hora;
    private String sentimento;
    private String notas;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getTipoEmocaoId() {
        return tipoEmocaoId;
    }

    public void setTipoEmocaoId(Long tipoEmocaoId) {
        this.tipoEmocaoId = tipoEmocaoId;
    }

    public String getTipoEmocaoNome() {
        return tipoEmocaoNome;
    }

    public void setTipoEmocaoNome(String tipoEmocaoNome) {
        this.tipoEmocaoNome = tipoEmocaoNome;
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
