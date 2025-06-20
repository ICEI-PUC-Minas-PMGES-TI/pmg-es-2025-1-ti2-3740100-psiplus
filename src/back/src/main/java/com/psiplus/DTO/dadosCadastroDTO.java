package com.psiplus.DTO;

import java.time.LocalDateTime;
import com.psiplus.model.Paciente;

public class dadosCadastroDTO {
    private LocalDateTime dataCadastro;
    public dadosCadastroDTO(Paciente paciente) {
        this.dataCadastro = paciente.getDataCadastro();
    }
    // Getters e Setters
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
}
