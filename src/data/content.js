import meta from './images.json'

/** Monta src/srcset de uma foto otimizada em public/img */
export function photo(name) {
  const m = meta[name]
  const widths = m.widths
  return {
    src: `/img/${name}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', '),
    width: m.w,
    height: m.h,
  }
}

export const logo = { src: '/img/logo.webp', fallback: '/img/logo.png', width: meta.logo.w, height: meta.logo.h }

const WA = 'https://wa.me/5547999059574?text='

/** Link de WhatsApp com mensagem pronta */
export const whatsappAbout = (assunto) =>
  WA + encodeURIComponent(`Olá! Gostaria de conversar sobre ${assunto} com um engenheiro da WM.`)

export const contact = {
  phoneDisplay: '(47) 99905-9574',
  phoneHref: 'tel:+5547999059574',
  email: 'williamanton51@gmail.com',
  whatsapp: WA + encodeURIComponent('Olá! Gostaria de solicitar uma proposta comercial para um projeto de automação.'),
}

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Simulação', href: '#simulacao' },
  { label: 'Processo', href: '#processo' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contato', href: '#contato' },
]

export const metrics = [
  { value: 0, suffix: '%', label: 'paradas imprevistas na integração' },
  { value: 35, suffix: '%', label: 'menos tempo de setup de máquina' },
  { value: 100, suffix: '%', label: 'dos CLPs e IHMs testados em simulação' },
]

/*
 * Serviços organizados pelas subpáginas do site original
 * (Programação de CLP, Painéis Elétricos, Movimentação de carga, Integração de Sistemas)
 * + os serviços de conformidade e campo da página de serviços.
 * image: nome em public/img · anim: mini-animação SVG quando não há foto
 */
export const servicePillars = [
  {
    id: 'clp',
    title: 'Programação de CLP e IHM',
    short: 'CLP e IHM',
    icon: 'plc',
    summary:
      'Arquiteturas de controle sob a norma IEC 61131-3. Simulamos 100% das rotinas em gêmeo digital antes da instalação física.',
    facts: ['IEC 61131-3', 'Ladder e texto estruturado', 'Profinet, EtherNet/IP, Modbus, OPC, CAN'],
    cards: [
      {
        name: 'Arquitetura de software',
        detail: 'Lógica modular e escalável',
        icon: 'code',
        image: 'clp-arquitetura',
        text: 'Programas organizados para facilitar manutenção, diagnóstico e futuras expansões, incluindo CLPs de segurança e E/S distribuída.',
        steps: ['Levantamento de E/S e sequências', 'Programa modular em ladder ou ST', 'Validação completa no gêmeo digital'],
      },
      {
        name: 'Interfaces IHM',
        detail: 'Operação, alarmes e diagnóstico',
        icon: 'hmi',
        image: 'clp-ihm',
        text: 'Telas claras para operar, monitorar e diagnosticar o processo, pensadas junto com quem opera a máquina.',
        steps: ['Fluxo de operação definido com o cliente', 'Telas, receitas e gestão de alarmes', 'Teste com o operador antes da partida'],
      },
      {
        name: 'Startup e comissionamento',
        detail: 'Partida assistida no local',
        icon: 'play2',
        image: 'clp-startup',
        text: 'Inicialização e validação completa dos sistemas, garantindo o funcionamento dos equipamentos e a confiabilidade do processo.',
        steps: ['Checklist de E/S em campo', 'Partida assistida por engenheiro', 'Ajuste fino e entrega documentada'],
      },
      {
        name: 'Integração OPC',
        detail: 'CLP, supervisório e sistemas',
        icon: 'network',
        image: 'clp-opc',
        text: 'Integração entre sistemas industriais, supervisórios e dispositivos, com troca de dados estruturada.',
        steps: ['Mapeamento das variáveis', 'Servidor OPC configurado', 'Dados disponíveis no supervisório'],
      },
      {
        name: 'Modbus TCP / RTU',
        detail: 'Inversores, medidores e sensores',
        icon: 'plug',
        image: 'clp-modbus',
        text: 'Comunicação confiável entre CLPs, inversores, sensores e outros dispositivos, com mapa de registradores documentado.',
        steps: ['Mapa de registradores', 'Configuração de rede e endereços', 'Teste de comunicação e falhas'],
      },
      {
        name: 'CAN Bus',
        detail: 'Troca de dados rápida',
        icon: 'can',
        image: 'clp-can',
        text: 'Integração de dispositivos por comunicação CAN, com troca de dados rápida e confiável em aplicações industriais.',
        steps: ['Definição das mensagens', 'Configuração dos nós', 'Validação de tempo de resposta'],
      },
    ],
  },
  {
    id: 'paineis',
    title: 'Painéis Elétricos',
    short: 'Painéis',
    icon: 'panel',
    summary:
      'Montagem robusta seguindo NR-10 e NR-12. Cada painel passa por ensaios de continuidade e isolação em laboratório antes do comissionamento.',
    facts: ['NR-10 e NR-12', 'NBR 5410', 'EPLAN e SEE Electrical'],
    cards: [
      {
        name: 'Projeto elétrico 3D',
        detail: 'EPLAN · gire o modelo em 3D',
        icon: 'cube',
        image: 'projeto-3d',
        model3d: true,
        text: 'Modelagem 3D do painel: layout, barramento, dissipação térmica e lista de materiais validada antes da compra.',
        steps: ['Levantamento de cargas', 'Modelo 3D e layout interno', 'Lista de materiais validada'],
      },
      {
        name: 'Diagramas em 72 h',
        detail: 'Unifilar, multifilar e funcional',
        icon: 'diagram',
        image: 'projeto-tela',
        text: 'Diagramas e lista de materiais entregues em até 72 horas, documentados conforme a NBR 5410.',
        steps: ['Envio do escopo', 'Diagramas em até 72 h', 'Revisão e documentação final'],
      },
      {
        name: 'Montagem de painéis',
        detail: 'Acabamento industrial NR-10',
        icon: 'panel',
        image: 'painel-montagem',
        text: 'Montagem e adequação com leitura de diagrama, identificação e testes, em layout pensado para manutenção rápida.',
        steps: ['Leitura do diagrama', 'Montagem e cablagem', 'Teste em bancada'],
      },
      {
        name: 'Bornes identificados',
        detail: 'Anilhas de alta durabilidade',
        icon: 'tag',
        image: 'painel-bornes',
        text: 'Cabos, bornes e componentes marcados um a um, simplificando diagnósticos e manutenções preventivas.',
        steps: ['Padrão de identificação', 'Anilhas em cada condutor', 'Documentação conferida'],
      },
      {
        name: 'Ensaios de isolação',
        detail: 'Continuidade e carga real',
        icon: 'meter',
        image: 'painel-barramento',
        text: 'Ensaios de continuidade, isolação e simulação de carga real em laboratório próprio: funciona no primeiro acionamento.',
        steps: ['Continuidade ponto a ponto', 'Ensaio de isolação', 'Simulação de carga real'],
      },
    ],
  },
  {
    id: 'carga',
    title: 'Movimentação de carga',
    short: 'Movimentação',
    icon: 'crane',
    summary:
      'Projetamos e adequamos pontes rolantes, guindastes giratórios e transportadores conforme NR-10 e NR-12, com foco em segurança e produtividade.',
    facts: ['Conformidade NR-12', 'Equipamentos inspecionados', 'Equipe capacitada'],
    cards: [
      {
        name: 'Ponte rolante',
        detail: 'Alta capacidade de carga',
        icon: 'crane',
        image: 'carga-ponte',
        text: 'Equipamento robusto para elevação e transporte de cargas pesadas, com estrutura reforçada e operação confiável.',
        steps: ['Levantamento de carga e vão', 'Projeto e adequação NR-12', 'Comissionamento e treinamento'],
      },
      {
        name: 'Pórtico rolante',
        detail: 'Pátios e áreas externas',
        icon: 'gantry',
        image: 'carga-portico',
        text: 'Equipamento versátil e seguro para movimentar cargas com precisão em diferentes operações.',
        steps: ['Estudo da área de trabalho', 'Projeto estrutural e elétrico', 'Instalação e inspeção'],
      },
      {
        name: 'Braço giratório',
        detail: 'Giro 360°, fácil operação',
        icon: 'jib',
        image: 'carga-braco',
        text: 'Movimentação segura no posto de trabalho, com giro de 360° e operação simples.',
        steps: ['Definição do raio de giro', 'Fixação e montagem', 'Teste de carga'],
      },
      {
        name: 'Linha de roletes',
        detail: 'Roletes motorizados',
        icon: 'roller',
        image: 'carga-roletes',
        text: 'Transporte com roletes motorizados: alta eficiência, baixa manutenção e integração personalizada ao processo.',
        steps: ['Layout do fluxo de materiais', 'Automação e sensores', 'Integração ao CLP da linha'],
      },
      {
        name: 'Retrofitting',
        detail: 'Modernização de equipamentos',
        icon: 'retrofit',
        image: 'carga-retrofit',
        text: 'Atualização de comandos, proteções e automação de equipamentos de movimentação existentes.',
        steps: ['Inspeção do equipamento', 'Novo comando e proteções', 'Laudo de adequação'],
      },
    ],
  },
  {
    id: 'integracao',
    title: 'Integração de Sistemas',
    short: 'Integração',
    icon: 'network',
    summary:
      'Conectamos ilhas de automação isoladas em uma arquitetura de rede industrial robusta, segura e monitorada em tempo real.',
    facts: ['Do sensor ao supervisório', 'Rede em camadas', 'Monitoramento em tempo real'],
    cards: [
      {
        name: 'Níveis 1 e 2',
        detail: 'Aquisição e controle',
        icon: 'layers',
        image: 'painel-io',
        text: 'CLPs e IHMs integrados ao maquinário. Sensores de campo transmitem dados operacionais críticos em tempo real.',
        steps: ['Sensores e atuadores', 'CLP e IHM na máquina', 'Dados enviados à supervisão'],
      },
      {
        name: 'Nível 3: SCADA',
        detail: 'Supervisão centralizada',
        icon: 'scada',
        image: 'clp-ihm-painel',
        text: 'Supervisório para controle operacional em tempo real, gestão de alarmes e visualização instantânea de gargalos.',
        steps: ['Coleta das máquinas', 'Telas e alarmes centralizados', 'Relatórios de eficiência'],
      },
      {
        name: 'Unificação de ilhas',
        detail: 'Máquinas legadas e novas',
        icon: 'network',
        anim: 'network',
        text: 'Máquinas antigas e novas conectadas em uma única arquitetura de rede industrial segura e de alta performance.',
        steps: ['Diagnóstico da rede atual', 'Gateways e padronização', 'Uma rede, um supervisório'],
      },
      {
        name: 'Redução de setup',
        detail: 'Coleta automática de dados',
        icon: 'chart',
        image: 'int-painel',
        text: 'Dados operacionais coletados automaticamente para encontrar gargalos ocultos e otimizar tempos de ciclo.',
        steps: ['Coleta automática de tempos', 'Análise de gargalos', 'Setup mais curto'],
      },
    ],
  },
  {
    id: 'conformidade',
    title: 'Conformidade e campo',
    short: 'Conformidade',
    icon: 'shield',
    summary:
      'Adequação às normas, documentação técnica e montagem em campo até a máquina estar pronta para operar.',
    facts: ['NR-10 e NR-12', 'ART e laudos', 'Montagem completa'],
    cards: [
      {
        name: 'Adequação NR-10 e NR-12',
        detail: 'Proteções e intertravamento',
        icon: 'shield',
        image: 'foto-5',
        text: 'Enclausuramentos, proteções, intertravamentos e dispositivos de segurança, com laudo técnico.',
        steps: ['Análise de risco', 'Proteções e intertravamentos', 'Laudo e ART'],
      },
      {
        name: 'ART elétrica e mecânica',
        detail: 'Laudo e análise de risco',
        icon: 'doc',
        image: 'foto-4',
        text: 'Análise de risco, laudos técnicos e ART para adequação de máquinas à NR-12.',
        steps: ['Vistoria técnica', 'Análise de risco', 'Emissão de laudo e ART'],
      },
      {
        name: 'Automatização de máquinas',
        detail: 'Alimentício, farma, têxtil',
        icon: 'gear',
        image: 'foto-6',
        text: 'Automação de máquinas para os setores alimentício, industrial, farmacêutico e têxtil.',
        steps: ['Estudo do processo', 'Automação e simulação', 'Partida na linha'],
      },
      {
        name: 'Montagens industriais',
        detail: 'Da base ao comissionamento',
        icon: 'wrench',
        image: 'foto-7',
        text: 'Montagem completa, da base ao comissionamento, entregue pronta para operar.',
        steps: ['Planejamento da montagem', 'Execução em campo', 'Entrega pronta para operar'],
      },
    ],
  },
]

export const steps = [
  { title: 'Projeto', text: 'Diagramas e modelo 3D do painel.', icon: 'diagram' },
  { title: 'Simulação', text: 'CLP e IHM testados no gêmeo digital.', icon: 'plc' },
  { title: 'Montagem', text: 'Painel montado e testado na bancada.', icon: 'panel' },
  { title: 'Comissionamento', text: 'Partida assistida no local.', icon: 'bolt' },
]

/* Painéis e projetos entregues: cards do carrossel */
export const gallery = [
  {
    name: 'projeto-3d',
    title: 'Painel de comando modelado em 3D',
    category: 'Projeto elétrico',
    text: 'Layout, barramento e dissipação validados no modelo antes da compra dos componentes.',
    specs: ['EPLAN', 'NBR 5410'],
  },
  {
    name: 'painel-montagem',
    title: 'Painel de distribuição e comando',
    category: 'Painéis elétricos',
    text: 'Cablagem organizada, bornes identificados e ensaio de isolação em laboratório.',
    specs: ['NR-10', 'Ensaio de isolação'],
  },
  {
    name: 'carga-ponte',
    title: 'Ponte rolante adequada à NR-12',
    category: 'Movimentação de carga',
    text: 'Comandos, proteções e sinalização adequados para operação segura em galpão.',
    specs: ['NR-12', 'Alta capacidade'],
  },
  {
    name: 'foto-2',
    title: 'Montagem de painel de comando',
    category: 'Painéis elétricos',
    text: 'Montagem em bancada com leitura de diagrama, identificação e teste antes do envio.',
    specs: ['Teste em bancada', 'Anilhas identificadas'],
  },
  {
    name: 'int-painel',
    title: 'Painel de E/S com IHM',
    category: 'Integração de sistemas',
    text: 'Módulos de E/S distribuídos e IHM touch integrados à rede industrial da planta.',
    specs: ['IHM touch', 'Rede industrial'],
  },
  {
    name: 'carga-portico',
    title: 'Pórtico rolante',
    category: 'Movimentação de carga',
    text: 'Movimentação de cargas em pátio externo com comando seguro e precisão.',
    specs: ['Área externa', 'NR-12'],
  },
  {
    name: 'foto-5',
    title: 'Enclausuramento NR-12',
    category: 'Segurança de máquinas',
    text: 'Proteções fixas e móveis com intertravamento para operação segura.',
    specs: ['NR-12', 'Intertravamento'],
  },
  {
    name: 'projeto-tela',
    title: 'Diagrama elétrico',
    category: 'Projeto elétrico',
    text: 'Diagramas unifilar, multifilar e funcional com lista de materiais.',
    specs: ['Entrega em 72 h', 'NBR 5410'],
  },
  {
    name: 'carga-braco',
    title: 'Braço giratório',
    category: 'Movimentação de carga',
    text: 'Movimentação no posto de trabalho com giro de 360° e operação simples.',
    specs: ['Giro 360°', 'Fácil operação'],
  },
  {
    name: 'foto-6',
    title: 'Automação de máquina',
    category: 'Automatização',
    text: 'Máquina automatizada com CLP e IHM, lógica testada antes da partida.',
    specs: ['CLP e IHM', 'Gêmeo digital'],
  },
  {
    name: 'carga-roletes',
    title: 'Linha de roletes automatizada',
    category: 'Transporte',
    text: 'Roletes motorizados integrados ao CLP da linha para fluxo contínuo de materiais.',
    specs: ['Roletes motorizados', 'Integração ao CLP'],
  },
  {
    name: 'foto-7',
    title: 'Transportador automatizado',
    category: 'Montagem industrial',
    text: 'Montagem completa do transportador, da base ao comissionamento.',
    specs: ['Montagem em campo', 'Comissionamento'],
  },
]
