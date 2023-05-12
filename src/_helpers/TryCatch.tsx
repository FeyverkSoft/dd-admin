import * as React from 'react';
import { Trans } from 'react-i18next';

export class TryCatch extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error: any, info: any) {
        this.setState({
            hasError: true,
            error: error,
            info: info
        });
    }
    render() {
        if (this.state.hasError) {
            return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <span role="img">
                    O-oops!!! 😨
                </span>{
                    process.env.NODE_ENV !== 'production' ?
                        <div>
                            <pre style={{ whiteSpace: 'pre-line' }}>
                                {JSON.stringify(this.state.error)}
                            </pre>
                            <pre style={{ whiteSpace: 'pre-line' }}>
                                {JSON.stringify(this.state.info)}
                            </pre>
                        </div>
                        : <Trans>Error</Trans>
                }
            </div>;
        }
        return this.props.children;
    }
}