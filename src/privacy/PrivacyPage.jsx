import Button from '../components/Button.jsx'
import { useConsent } from '../lgpd/PrivacyProvider.jsx'
import { contact } from '../data/content.js'
import './PrivacyPage.css'

/* Campos a preencher pela empresa ficam destacados */
const Fill = ({ children }) => <mark className="fill">[{children}]</mark>

const UPDATED = '2 de novembro de 2026'

export default function PrivacyPage() {
  const { openPreferences } = useConsent()
  return (
    <main id="conteudo" className="privacy on-light">
      <div className="privacy__hero">
        <div className="container">
          <h1>Política de Privacidade e Cookies</h1>
          <p>Última atualização: {UPDATED}</p>
        </div>
      </div>

      <article className="container privacy__body">
        <section aria-labelledby="p1">
          <h2 id="p1">1. Quem é o controlador dos dados</h2>
          <p>
            Este site é mantido por <Fill>RAZÃO SOCIAL</Fill>, inscrita no CNPJ <Fill>CNPJ</Fill>, com sede em{' '}
            <Fill>ENDEREÇO</Fill>, Jaraguá do Sul, SC, doravante “WM Soluções em Automação”. Tratamos dados pessoais
            de acordo com a Lei Geral de Proteção de Dados Pessoais (Lei 13.709/2018, LGPD).
          </p>
        </section>

        <section aria-labelledby="p2">
          <h2 id="p2">2. Quais dados tratamos</h2>
          <ul>
            <li>
              <strong>Dados que você nos envia</strong> ao entrar em contato por WhatsApp, e-mail ou telefone: nome,
              telefone, e-mail, empresa e as informações técnicas do seu projeto. Este site não tem formulários e não
              coleta esses dados diretamente.
            </li>
            <li>
              <strong>Dados de navegação</strong>, somente se você autorizar cookies de estatística: páginas
              visitadas, tempo de visita, tipo de dispositivo e navegador, cidade aproximada. O endereço IP é
              anonimizado.
            </li>
            <li>
              <strong>Sua escolha de cookies</strong>, guardada no seu próprio navegador.
            </li>
          </ul>
        </section>

        <section aria-labelledby="p3">
          <h2 id="p3">3. Para que usamos e com qual base legal</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Finalidade</th>
                  <th scope="col">Base legal (art. 7º da LGPD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Responder pedidos de orçamento e contato</td>
                  <td>Procedimentos preliminares a contrato, a pedido do titular (inciso V)</td>
                </tr>
                <tr>
                  <td>Executar serviços contratados e emitir documentos técnicos (ART, laudos)</td>
                  <td>Execução de contrato (inciso V) e cumprimento de obrigação legal (inciso II)</td>
                </tr>
                <tr>
                  <td>Estatísticas de uso do site</td>
                  <td>Consentimento (inciso I), que pode ser revogado a qualquer momento</td>
                </tr>
                <tr>
                  <td>Guardar sua escolha de cookies</td>
                  <td>Legítimo interesse e cumprimento da própria LGPD (incisos IX e II)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="p4">
          <h2 id="p4">4. Cookies e tecnologias semelhantes</h2>
          <p>
            Cookies não essenciais só são ativados depois do seu consentimento. Você pode mudar a escolha quando quiser.
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Finalidade</th>
                  <th scope="col">Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>wm-consent (armazenamento local)</td>
                  <td>Necessário</td>
                  <td>Guarda a sua escolha de cookies</td>
                  <td>12 meses</td>
                </tr>
                <tr>
                  <td>_ga</td>
                  <td>Estatística</td>
                  <td>Google Analytics: distingue visitantes de forma anônima</td>
                  <td>2 anos</td>
                </tr>
                <tr>
                  <td>_ga_&lt;ID&gt;</td>
                  <td>Estatística</td>
                  <td>Google Analytics: mantém o estado da sessão</td>
                  <td>2 anos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            <Button variant="orange" size="sm" onClick={openPreferences}>
              Alterar preferências de cookies
            </Button>
          </p>
        </section>

        <section aria-labelledby="p5">
          <h2 id="p5">5. Compartilhamento e transferência internacional</h2>
          <p>
            Não vendemos dados pessoais. Se você autorizar estatísticas, os dados de navegação são processados pelo
            Google LLC (Google Analytics), com servidores nos Estados Unidos e em outros países, com base em cláusulas
            contratuais padrão (art. 33 da LGPD). Conversas por WhatsApp seguem também a política da Meta Platforms.
            Também podemos compartilhar dados quando a lei exigir ou por ordem de autoridade competente.
          </p>
        </section>

        <section aria-labelledby="p6">
          <h2 id="p6">6. Por quanto tempo guardamos</h2>
          <p>
            Contatos comerciais sem contratação: até 2 anos após o último contato. Documentos de serviços contratados:
            pelo prazo exigido em lei (por exemplo, 5 anos para documentos fiscais). Dados de estatística: até 14 meses
            no Google Analytics.
          </p>
        </section>

        <section aria-labelledby="p7">
          <h2 id="p7">7. Seus direitos</h2>
          <p>Conforme o art. 18 da LGPD, você pode a qualquer momento pedir:</p>
          <ul>
            <li>confirmação de que tratamos seus dados e acesso a eles;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>portabilidade a outro fornecedor;</li>
            <li>informação sobre com quem compartilhamos seus dados;</li>
            <li>revogação do consentimento e eliminação dos dados tratados com base nele.</li>
          </ul>
          <p>
            Respondemos em até 15 dias. Você também pode registrar reclamação na Autoridade Nacional de Proteção de
            Dados (ANPD), em <a href="https://www.gov.br/anpd">gov.br/anpd</a>.
          </p>
        </section>

        <section aria-labelledby="p8">
          <h2 id="p8">8. Segurança</h2>
          <p>
            O site usa conexão criptografada (HTTPS), não depende de serviços de terceiros antes do seu consentimento
            e hospeda fontes, imagens e vídeos no próprio domínio. O acesso interno a dados de clientes é restrito a
            quem precisa deles para executar o serviço.
          </p>
        </section>

        <section aria-labelledby="p9">
          <h2 id="p9">9. Encarregado de dados (DPO)</h2>
          <p>
            Encarregado: <Fill>NOME DO ENCARREGADO</Fill>. Para exercer seus direitos ou tirar dúvidas, escreva para{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a> ou ligue para{' '}
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
          </p>
        </section>

        <section aria-labelledby="p10">
          <h2 id="p10">10. Alterações nesta política</h2>
          <p>
            Esta política pode ser atualizada. A data no topo indica a versão em vigor. Mudanças relevantes no uso de
            cookies farão o aviso de consentimento aparecer de novo.
          </p>
        </section>
      </article>
    </main>
  )
}
