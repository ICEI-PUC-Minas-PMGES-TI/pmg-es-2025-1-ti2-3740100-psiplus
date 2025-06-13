package com.psiplus.DTO;

public class ContagemEmocaoDTO {
    private String nome;
    private Long total;

    public ContagemEmocaoDTO(String nome, Long total) {
        this.nome = nome;
        this.total = total;
    }

    public String getNome() {
        return nome;
    }

    public Long getTotal() {
        return total;
    }
}
