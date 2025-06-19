package com.psiplus.DTO;

import java.time.LocalDateTime;
import java.util.Objects;

public class HorarioDisponivelDTO {

    private LocalDateTime inicio;
    private LocalDateTime fim;
    private boolean recorrente;

    public HorarioDisponivelDTO() {
    }

    public HorarioDisponivelDTO(LocalDateTime inicio, LocalDateTime fim, boolean recorrente) {
        this.inicio = inicio;
        this.fim = fim;
        this.recorrente = recorrente;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public void setInicio(LocalDateTime inicio) {
        this.inicio = inicio;
    }

    public LocalDateTime getFim() {
        return fim;
    }

    public void setFim(LocalDateTime fim) {
        this.fim = fim;
    }

    @Override
    public String toString() {
        return "HorarioDisponivelDTO{" +
                "inicio=" + inicio +
                ", fim=" + fim +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HorarioDisponivelDTO)) return false;
        HorarioDisponivelDTO that = (HorarioDisponivelDTO) o;
        return inicio.equals(that.inicio) && fim.equals(that.fim);
    }

    @Override
    public int hashCode() {
        return Objects.hash(inicio, fim);
    }

    public boolean isRecorrente() {
        return recorrente;
    }

    public void setRecorrente(boolean recorrente) {
        this.recorrente = recorrente;
    }
}
