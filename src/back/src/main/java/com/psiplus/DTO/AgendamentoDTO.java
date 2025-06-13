package com.psiplus.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

public class AgendamentoDTO {
    private Long pacienteId;
    private Long psicologoId;
    private LocalDate data;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;

    public AgendamentoDTO() {}

    public AgendamentoDTO(Long pacienteId, Long psicologoId, LocalDate data, LocalTime horarioInicio, LocalTime horarioFim) {
        this.pacienteId = pacienteId;
        this.psicologoId = psicologoId;
        this.data = data;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getPsicologoId() {
        return psicologoId;
    }

    public void setPsicologoId(Long psicologoId) {
        this.psicologoId = psicologoId;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(LocalTime horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public LocalTime getHorarioFim() {
        return horarioFim;
    }

    public void setHorarioFim(LocalTime horarioFim) {
        this.horarioFim = horarioFim;
    }

    @Override
    public String toString() {
        return "AgendamentoDTO{" +
                "pacienteId=" + pacienteId +
                ", psicologoId=" + psicologoId +
                ", data=" + data +
                ", horarioInicio=" + horarioInicio +
                ", horarioFim=" + horarioFim +
                '}';
    }
}
