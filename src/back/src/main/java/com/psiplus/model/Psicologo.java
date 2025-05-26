package com.psiplus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "psicologo")
public class Psicologo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long psicologoId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuarioId")
    private Usuario usuario;

    @Column(length = 100)
    private String registro;

    @Column(length = 500)
    private String especialidades;

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
    public String getRegistro() {
        return registro;
    }
    public void setRegistro(String registro) {
        this.registro = registro;
    }
    public String getEspecialidades() {
        return especialidades;
    }
    public void setEspecialidades(String especialidades) {
        this.especialidades = especialidades;
    }
}
