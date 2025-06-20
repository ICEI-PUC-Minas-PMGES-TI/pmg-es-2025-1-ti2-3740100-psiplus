package com.psiplus.DTO;

public class PacienteAgendamentoDTO {
    private Long pacienteId;
    private String nome;
    private Long psicologoId;
    private String psicologoNome;

    public PacienteAgendamentoDTO(Long pacienteId, String nome, Long psicologoId, String psicologoNome) {
        this.pacienteId = pacienteId;
        this.nome = nome;
        this.psicologoId = psicologoId;
        this.psicologoNome = psicologoNome;
    }

    // Getters e setters
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Long getPsicologoId() { return psicologoId; }
    public void setPsicologoId(Long psicologoId) { this.psicologoId = psicologoId; }
    public String getPsicologoNome() { return psicologoNome; }
    public void setPsicologoNome(String psicologoNome) { this.psicologoNome = psicologoNome; }
}