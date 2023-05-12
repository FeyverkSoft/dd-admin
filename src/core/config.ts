export class Config {
    static Debug: boolean = true;

    public static GetUrl(): string {
        return localStorage.getItem('dobrodom_api_url') || (window.config || {}).api || 'https://dobrodom.online/api/';
    }

    public static BuildUrl(url: string, params: any = null): string {
        let baseUrl: string = Config.GetUrl();

        let temp: string = `${baseUrl.replace(/^[\\|/]+|[\\|/]+$/g, '')}/${url.replace(/^[\\|/]+|[\\|/]+$/g, '')}`;
        let result: URL = new URL(temp);
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key]) {
                    if (Array.isArray(params[key])) {
                        params[key].forEach((element: any) => {
                            result.searchParams.append(key, element);
                        });
                    }
                    else
                        result.searchParams.append(key, params[key]);
                }

            });
            return result.toString();
        }
        return result.toString();
    }
}