package com.psiplus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "psicologo")
public class Psicologo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long psicologoId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // Getters e Setters
    public Long getPsicologoId() {
        return psicologoId;
    }
    public void setPsicologoId(Long psicologoId) {
        this.psicologoId = psicologoId;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
