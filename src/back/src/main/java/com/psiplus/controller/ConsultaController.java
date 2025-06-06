package com.psiplus.controller;

import com.psiplus.DTO.AgendamentoDTO;
import com.psiplus.model.Consulta;
import com.psiplus.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/consultas")
@CrossOrigin(origins = "http://localhost:5173") // ajuste se necessário
public class ConsultaController {

    @Autowired
    private ConsultaRepository consultaRepository;

    @PostMapping("/agendar")
        public Consulta agendarConsulta(@RequestBody AgendamentoDTO dto) {
            System.out.println("DTO recebido: " + dto); // 🚀 Verifique os dados recebidos
            Consulta nova = new Consulta();
            nova.setPacienteId(dto.pacienteId);
            nova.setData(LocalDate.parse(dto.data));
            nova.setHorarioInicio(LocalTime.parse(dto.horarioInicio));
            nova.setHorarioFim(LocalTime.parse(dto.horarioFim));
            return consultaRepository.save(nova);
    }
}
