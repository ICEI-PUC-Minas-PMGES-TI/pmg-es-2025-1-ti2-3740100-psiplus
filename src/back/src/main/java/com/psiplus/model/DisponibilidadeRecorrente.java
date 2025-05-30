package com.psiplus.model;

import com.psiplus.model.Psicologo;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "disponibilidade_recorrente")
public class DisponibilidadeRecorrente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long disponibilidadeId;

    @ManyToOne
    @JoinColumn(name = "psicologoId", nullable = false)
    private Psicologo psicologo;

    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana; // 0 = domingo, 1 = segunda...

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fim", nullable = false)
    private LocalTime horaFim;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    // Getters e Setters

    public Long getId() {
        return disponibilidadeId;
    }

    public void setId(Long disponibilidadeId) {
        this.disponibilidadeId = disponibilidadeId;
    }

    public Psicologo getPsicologo() {
        return psicologo;
    }

    public void setPsicologo(Psicologo psicologo) {
        this.psicologo = psicologo;
    }

    public Integer getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(Integer diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }


}
