package com.psiplus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tipo_emocao")
public class TipoEmocao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tipo_emocao_id")
    private Long id;

    @Column(nullable = false)
    private String nome;

    public TipoEmocao() {}

    public TipoEmocao(String nome) {
        this.nome = nome;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
