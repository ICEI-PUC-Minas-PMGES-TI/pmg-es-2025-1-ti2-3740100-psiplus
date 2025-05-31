package com.psiplus.util;

public class EmailTemplates {
    public static String gerarBoasVindas(String nome, String email, String senha) {
        String link = "https://sistema.psiplus.fake/login"; // link fictício por enquanto
        return """
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #333;">Olá, %s!</h2>
              <p>Seu cadastro no <strong>Sistema Psi+</strong> foi realizado com sucesso.</p>
              <p><strong>Dados de acesso:</strong></p>
              <ul>
                <li><strong>Usuário:</strong> %s</li>
                <li><strong>Senha:</strong> %s</li>
              </ul>
              <p>Acesse o sistema pelo link abaixo:</p>
              <a href="%s" style="display: inline-block; padding: 10px 20px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 5px;">Acessar o sistema</a>
              <p style="margin-top: 20px;">Recomendamos que você altere sua senha após o primeiro acesso.</p>
              <p style="color: #777;">Atenciosamente,<br>Equipe Psi+</p>
            </div>
          </body>
        </html>
        """.formatted(nome, email, senha, link);
    }
}
