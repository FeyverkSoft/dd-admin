import * as React from 'react';

interface IFProps<T = any> {
    value?: boolean | React.ReactNode | T;
    in?: Array<T>;
}

class _IF extends React.Component<React.PropsWithChildren<IFProps>>
{
    render() {
        if (this.props.in && this.props.in.length > 0) {
            if (this.props.in.includes(this.props.value))
                return <>{this.props.children}</>;
            return <></>;
        }
        if (this.props.value)
            return <>{this.props.children}</>;
        else
            return <></>;
    }
}

export const IF = React.memo(({ ...props }: React.PropsWithChildren<IFProps>) => <_IF {...props} />);