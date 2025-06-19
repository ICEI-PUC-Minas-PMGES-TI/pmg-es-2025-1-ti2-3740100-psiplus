package com.psiplus.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "paciente_id")
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

    @Column(name = "paciente_arquivado")
    private Boolean arquivado = false;

    @ManyToOne
    @JoinColumn(name = "psicologo_id")
    @JsonBackReference
    private Psicologo psicologo;

    @CreationTimestamp
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

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
    public Boolean getArquivado(){ return arquivado; }
    public void setArquivado(Boolean arquivado){ this.arquivado = arquivado; }
    public Psicologo getPsicologo() { return psicologo; }
    public void setPsicologo (Psicologo psicologo){ this.psicologo = psicologo; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }

}
