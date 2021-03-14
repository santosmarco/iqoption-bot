import { Bot, IQSignal } from "./classes";

const bot = new Bot({
  urls: {
    signIn: "https://login.iqoption.com/en/login",
    tradeRoom: "https://iqoption.com/traderoom",
  },
  components: {
    emailInput: { x: 800, y: 200 },
    passwordInput: { x: 800, y: 270 },
    signInBtn: { x: 800, y: 330 },
    openNewAssetBtn: { x: 415, y: 35 },
    searchAssetInput: { x: 785, y: 35 },
    searchedAssetBtn: { x: 785, y: 120 },
  },
});

bot.runSignals(
  IQSignal.parse(`*Fábrica de Sinais FREE* 📈 12/03/2021
⚠️ Entrar sempre 2 segundos antes do horário do sinal (IQ option tem delay)
⚠️ Siga sempre a tendência “nunca faça entradas contra a tendência”
💡 *Muito importante:* Saiba gerenciar sua banca! Não vá na loucura, o mercado financeiro não perdoa quem "brinca". Bateu a meta? SAIA do mercado e volte no dia seguinte! 
❌ E se eu tomar loss? -> Utilizar um martingale com a mesma configuração do sinal (se quiser usar dois martingales, vai de cada pessoa)
*Lembrete* -> O loss faz parte, aceite, porque você vai sempre passar por isso! Saiba ter mentalidade pra poder recuperar sem desespero! 
⚠️ Sempre olhe as notícias, se tiver tendo notícias nos pares de moeda que você vai operar, NÃO OPERE! 
🗞️ *Quer saber das notícias?* -> https://br.investing.com/economic-calendar/
⚠ Sinais em M5 ⚠
M5;AUDUSD;03:50:00;PUT✅
M5;EURJPY;06:05:00;PUT✅
M5;GBPUSD;08:45:00;PUT✅
M5;AUDJPY;10:10:00;PUT✅G2
M5;EURGBP;12:00:00;PUT✅
M5;USDCAD;13:50:00;PUT✅
Call -> Compra 👆🏼 🟢 
Put -> Venda 👇🏼 🔴
💎 *CURSO+SALA VIP* 💎 
💰 De 40 a 55 sinais de SEG A SAB
🔐 Sinais em OTC aos sábados.
📚 + de 50.000 reais em cursos disponíveis dos melhores do mercado.
🚨 Lista de 1 Gale.
💸 MÉTODO TESTADO E COMPROVADO, PARA VOCÊ GANHAR MAIS DE R$1596,00, SEM OPERAR NO MERCADO FINANCEIRO ❌
———————————————
BOT DE DUVIDAS 🤖👇🏻
@suportedafabricabot
Instagram OFICIAL da Fábrica ✅
https://bit.ly/instagramFDS
💭 Quer ter mais informações sobre a nova turma VIP PREMIUM? 👇🏼
Meu WhatsApp`)
);
