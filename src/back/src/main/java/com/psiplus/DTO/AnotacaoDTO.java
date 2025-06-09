package com.psiplus.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalTime;

public class AnotacaoDTO {

    @NotNull(message = "O ID do paciente é obrigatório")
    @JsonProperty("pacienteId")
    private Long pacienteId;

    @NotNull(message = "A data do registro é obrigatória")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("data")
    private LocalDate data;

    @NotNull(message = "A hora do registro é obrigatória")
    @JsonFormat(pattern = "HH:mm:ss")
    @JsonProperty("hora")
    private LocalTime hora;

    @NotBlank(message = "A anotação não pode estar vazia")
    @JsonProperty("conteudo")
    private String conteudo;

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
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

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
}
