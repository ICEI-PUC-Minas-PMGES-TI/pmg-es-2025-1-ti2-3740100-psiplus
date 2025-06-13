package com.psiplus.DTO;

public class PacienteComPsicologoDTO {
    private Long pacienteId;
    private String nome;
    private Long psicologoId;
    private String psicologoNome;

    public PacienteComPsicologoDTO(com.psiplus.model.Paciente paciente) {
        this.pacienteId = paciente.getPacienteId();
        this.nome = paciente.getUsuario().getNome();
        if (paciente.getPsicologo() != null) {
            this.psicologoId = paciente.getPsicologo().getPsicologoId();
            this.psicologoNome = paciente.getPsicologo().getUsuario().getNome();
        }
    }

    // getters e setters
    public Long getPacienteId() { return pacienteId; }
    public String getNome() { return nome; }
    public Long getPsicologoId() { return psicologoId; }
    public String getPsicologoNome() { return psicologoNome; }
}