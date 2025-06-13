package com.psiplus.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public class ConsultaDTO {
    private Long idConsulta;
    private LocalDate data;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;

    private Long pacienteId;
    private String pacienteNome;

    private Long psicologoId;
    private String psicologoNome;

    // Getters e Setters
    public Long getIdConsulta() { return idConsulta; }
    public void setIdConsulta(Long idConsulta) { this.idConsulta = idConsulta; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getPacienteNome() { return pacienteNome; }
    public void setPacienteNome(String pacienteNome) { this.pacienteNome = pacienteNome; }

    public Long getPsicologoId() { return psicologoId; }
    public void setPsicologoId(Long psicologoId) { this.psicologoId = psicologoId; }

    public String getPsicologoNome() { return psicologoNome; }
    public void setPsicologoNome(String psicologoNome) { this.psicologoNome = psicologoNome; }
}
