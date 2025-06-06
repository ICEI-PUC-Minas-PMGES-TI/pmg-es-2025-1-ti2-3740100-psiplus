package com.psiplus.DTO;

public class AgendamentoDTO {
    public Long pacienteId;
    public Long psicologoId;
    public String data;
    public String horarioInicio;
    public String horarioFim;

    public AgendamentoDTO() {}

    public AgendamentoDTO(Long pacienteId, Long psicologoId, String data, String horarioInicio, String horarioFim) {
        this.pacienteId = pacienteId;
        this.psicologoId = psicologoId;
        this.data = data;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
    }

    @Override
    public String toString() {
        return "AgendamentoDTO{" +
                "pacienteId=" + pacienteId +
                ", psicologoId=" + psicologoId +
                ", data='" + data + '\'' +
                ", horarioInicio='" + horarioInicio + '\'' +
                ", horarioFim='" + horarioFim + '\'' +
                '}';
    }
}
