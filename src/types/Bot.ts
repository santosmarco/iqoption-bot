export interface BotComponentConfig {
  x: number;
  y: number;
}

export interface BotConfig {
  urls: {
    signIn: string;
    tradeRoom: string;
  };
  components: {
    emailInput: BotComponentConfig;
    passwordInput: BotComponentConfig;
    signInBtn: BotComponentConfig;
    openNewAssetBtn: BotComponentConfig;
    searchAssetInput: BotComponentConfig;
    searchedAssetBtn: BotComponentConfig;
  };
}

export interface BotMethodOptions {
  sleepAfter?: number;
}
