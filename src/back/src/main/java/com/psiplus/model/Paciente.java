package com.psiplus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paciente_id")  // Recomendo explicitar o nome da coluna
    private Long pacienteId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(columnDefinition = "TEXT")
    private String historicoClinico;

    @Column(name = "senha_redefinida")
    private Boolean senhaRedefinida = false;

    @Column(length = 500)
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String notas;

    // Getters e Setters

    public Boolean isSenhaRedefinida() {
        return senhaRedefinida;
    }

    public void setSenhaRedefinida(Boolean senhaRedefinida) {
        this.senhaRedefinida = senhaRedefinida;
    }
    public Long getPacienteId() {
        return pacienteId;
    }
    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    public String getHistoricoClinico() {
        return historicoClinico;
    }
    public void setHistoricoClinico(String historicoClinico) {
        this.historicoClinico = historicoClinico;
    }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

}
