package com.psiplus.controller;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.psiplus.DTO.dadosCadastroDTO;
import com.psiplus.DTO.PacienteAgendamentoDTO;
import com.psiplus.DTO.PacienteComPsicologoDTO;
import com.psiplus.DTO.PacienteDTO;
import com.psiplus.DTO.dadosCadastroDTO;
import com.psiplus.DTO.RedefinicaoSenhaDTO;
import com.psiplus.model.Paciente;
import com.psiplus.model.Psicologo;
import com.psiplus.model.LoginRequest;
import com.psiplus.model.Usuario;
import com.psiplus.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    public List<PacienteDTO> listar(@RequestParam(required = false) String nome) {
        return nome != null ? service.buscarPorNome(nome) : service.listarResumo();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscar(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/{id}/com-psicologo")
    public ResponseEntity<PacienteComPsicologoDTO> buscarComPsicologo(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new PacienteComPsicologoDTO(paciente));
    }


    @PostMapping
    public ResponseEntity<Paciente> salvar(@RequestBody Paciente paciente) {
        Paciente salvo = service.salvar(paciente);
        URI uri = URI.create(String.format("/pacientes/%s", salvo.getPacienteId()));
        return ResponseEntity.created(uri).body(salvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Paciente paciente = service.buscarPorId(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

@GetMapping("/{id}/dados-agendamento")
public ResponseEntity<PacienteAgendamentoDTO> getDadosParaAgendamento(@PathVariable Long id) {
    Paciente paciente = service.buscarPorId(id);
    if (paciente == null) {
        return ResponseEntity.notFound().build();
    }
    Long psicologoId = null;
    String psicologoNome = null;
    if (paciente.getPsicologo() != null) {
        psicologoId = paciente.getPsicologo().getPsicologoId();
        psicologoNome = paciente.getPsicologo().getUsuario().getNome();
    }
    PacienteAgendamentoDTO dto = new PacienteAgendamentoDTO(
        paciente.getPacienteId(),
        paciente.getUsuario().getNome(),
        psicologoId,
        psicologoNome
    );
    return ResponseEntity.ok(dto);
}

    @PutMapping("/{pacienteId}/associar-psicologo/{psicologoId}")
    public ResponseEntity<?> associarPsicologo(
            @PathVariable Long pacienteId,
            @PathVariable Long psicologoId) {
        Paciente paciente = service.buscarPorId(pacienteId);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        Psicologo psicologo = service.buscarPsicologoPorId(psicologoId);
        if (psicologo == null) {
            return ResponseEntity.badRequest().body("Psicólogo não encontrado");
        }
        paciente.setPsicologo(psicologo);
        service.salvar(paciente);
        return ResponseEntity.ok().build();
    }

        @PutMapping("/arquivar")
    public ResponseEntity<Void> arquivarPacientes(@RequestBody List<Long> ids) {
        service.arquivarPacientes(ids);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/acao/desarquivar")
    public ResponseEntity<Void> desarquivarPacientes(@RequestBody List<Long> ids) {
        System.out.println("IDs recebidos: " + ids);
        service.desarquivarPacientes(ids);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Paciente pacienteAtualizado) {

        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "ID do paciente inválido."));
        }

        Paciente existente = service.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erro", "Paciente não encontrado com o ID: " + id));
        }

        // Proteções: impedir edição de campos sensíveis
        if (existente.getUsuario() != null && pacienteAtualizado.getUsuario() != null) {
            Usuario usuarioExistente = existente.getUsuario();
            Usuario usuarioAtualizado = pacienteAtualizado.getUsuario();

            usuarioAtualizado.setUsuarioId(usuarioExistente.getUsuarioId());
            usuarioAtualizado.setCpfCnpj(usuarioExistente.getCpfCnpj());
            usuarioAtualizado.setSenha(usuarioExistente.getSenha());

            if (usuarioExistente.getEndereco() != null && usuarioAtualizado.getEndereco() != null) {
                usuarioAtualizado.getEndereco().setId(usuarioExistente.getEndereco().getId());
            }
        }

        pacienteAtualizado.setPacienteId(id);
        pacienteAtualizado.setHistoricoClinico(existente.getHistoricoClinico());
        pacienteAtualizado.setSenhaRedefinida(existente.isSenhaRedefinida());
        pacienteAtualizado.setArquivado(existente.getArquivado());
        pacienteAtualizado.setPsicologo(existente.getPsicologo());

        if (pacienteAtualizado.getPsicologo() == null) {
            pacienteAtualizado.setPsicologo(existente.getPsicologo());
}
        try {
            Paciente salvo = service.salvar(pacienteAtualizado);
            if (salvo == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("erro", "Falha ao salvar paciente"));
            }
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @RestControllerAdvice
  public class GlobalExceptionHandler {
    @ExceptionHandler(NumberFormatException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleNumberFormatException(NumberFormatException ex) {
      Map<String, String> erro = new HashMap<>();
      erro.put("erro", "ID inválido: deve ser um número válido.");
      return erro;
    }
  }

    @GetMapping("/resumo")
    public List<PacienteDTO> listarResumo() {
        return service.listarResumo();
    }

    @GetMapping("/dadosCadastro")
    public List<dadosCadastroDTO> listarDadosCadastro(){ return service.listarDadosCadastro();}


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Paciente paciente = service.autenticar(request.getEmail(), request.getSenha());
        System.out.println(paciente);
        System.out.println(request.getEmail());
        System.out.println(request.getSenha());
        if (paciente == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Email ou senha inválidos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
        }
        return ResponseEntity.ok(paciente);
    }

    @PutMapping("/{id}/historico-clinico")
    public ResponseEntity<?> atualizarHistoricoClinico(@PathVariable Long id, @RequestBody String anotacoes) {
        boolean atualizado = service.atualizarHistoricoClinico(id, anotacoes);
        if (!atualizado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<?> redefinirSenha(@RequestBody RedefinicaoSenhaDTO dto) {
        boolean sucesso = service.redefinirSenha(dto.getEmail(), dto.getSenhaAntiga(), dto.getNovaSenha(), dto.getConfirmarSenha());
        if (sucesso) {
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Senha antiga incorreta ou paciente não encontrado.");
        }
    }
}