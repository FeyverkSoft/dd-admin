interface Config {
    api?: string;
    preload: IStore
}

interface Window {
    config: Config;
}
