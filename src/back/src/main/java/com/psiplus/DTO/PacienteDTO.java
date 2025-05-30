package back.src.main.java.com.psiplus.DTO;

import com.psiplus.model.Paciente;
import com.psiplus.model.Usuario;

import java.time.format.DateTimeFormatter;

public class PacienteDTO {

    private Long pacienteId;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private String nascimento;

    public PacienteDTO(Paciente paciente) {
        this.pacienteId = paciente.getPacienteId();

        Usuario usuario = paciente.getUsuario();
        this.nome = usuario.getNome();
        this.cpf = usuario.getCpfCnpj();
        this.email = usuario.getEmail();
        this.telefone = usuario.getTelefone();
        this.nascimento = usuario.getDataNascimento() != null
                ? usuario.getDataNascimento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                : "";
    }

    // Getters e Setters
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getNascimento() { return nascimento; }
    public void setNascimento(String nascimento) { this.nascimento = nascimento; }
}