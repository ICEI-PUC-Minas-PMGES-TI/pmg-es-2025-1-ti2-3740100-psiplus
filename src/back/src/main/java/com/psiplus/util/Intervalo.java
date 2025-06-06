package com.psiplus.util;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Intervalo {
    private LocalDateTime inicio;
    private LocalDateTime fim;

    public Intervalo(LocalDateTime inicio, LocalDateTime fim) {
        this.inicio = inicio;
        this.fim = fim;
    }

    public LocalDateTime getInicio() {
        return inicio;
    }

    public LocalDateTime getFim() {
        return fim;
    }

    public List<Intervalo> remover(LocalDateTime indisponivelInicio, LocalDateTime indisponivelFim) {
        List<Intervalo> resultado = new ArrayList<>();

        // Nenhuma interseção
        if (indisponivelFim.isBefore(inicio) || indisponivelInicio.isAfter(fim)) {
            resultado.add(this);
            return resultado;
        }

        // Interseção parcial à esquerda
        if (indisponivelInicio.isAfter(inicio)) {
            resultado.add(new Intervalo(inicio, indisponivelInicio));
        }

        // Interseção parcial à direita
        if (indisponivelFim.isBefore(fim)) {
            resultado.add(new Intervalo(indisponivelFim, fim));
        }

        return resultado;
    }
}
