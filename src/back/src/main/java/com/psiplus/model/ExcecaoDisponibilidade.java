package com.psiplus.model;

import com.psiplus.util.TipoExcecao;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "excecao_disponibilidade")
public class ExcecaoDisponibilidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long excecaoDisponibilidadeId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "psicologoId")
    private Psicologo psicologo;

    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;

    @Column(name = "motivo")
    private String motivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_excecao", nullable = false)
    private TipoExcecao tipo;

    @ManyToOne
    @JoinColumn(name = "recorrente_id")
    private DisponibilidadeRecorrente recorrenteRelacionada;

    // Getters e Setters
    public Long getId() { return excecaoDisponibilidadeId; }
    public void setId(Long excecaoDisponibilidadeId) { this.excecaoDisponibilidadeId = excecaoDisponibilidadeId; }

    public Psicologo getPsicologo() { return psicologo; }
    public void setPsicologo(Psicologo psicologo) { this.psicologo = psicologo; }

    public LocalDateTime getDataHoraInicio() { return dataHoraInicio; }
    public void setDataHoraInicio(LocalDateTime dataHoraInicio) { this.dataHoraInicio = dataHoraInicio; }

    public LocalDateTime getDataHoraFim() { return dataHoraFim; }
    public void setDataHoraFim(LocalDateTime dataHoraFim) { this.dataHoraFim = dataHoraFim; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public DisponibilidadeRecorrente getRecorrenteRelacionada() { return recorrenteRelacionada; }
    public void setRecorrenteRelacionada(DisponibilidadeRecorrente recorrenteRelacionada) {
        this.recorrenteRelacionada = recorrenteRelacionada;
    }

    public TipoExcecao getTipo() { return tipo; }
    public void setTipo(TipoExcecao tipo) { this.tipo = tipo; }

}
