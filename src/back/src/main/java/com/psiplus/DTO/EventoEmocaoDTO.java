package com.psiplus.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventoEmocaoDTO {
    private String nome;
    private LocalDate data;
    private LocalTime hora;
    private String sentimento;
    private String notas;

    public EventoEmocaoDTO(String nome, LocalDate data, LocalTime hora, String sentimento, String notas) {
        this.nome = nome;
        this.data = data;
        this.hora = hora;
        this.sentimento = sentimento;
        this.notas = notas;
    }

    public String getNome() {
        return nome;
    }

    public LocalDate getData() {
        return data;
    }

    public LocalTime getHora() {
        return hora;
    }

    public String getSentimento() {
        return sentimento;
    }

    public String getNotas() {
        return notas;
    }
}
