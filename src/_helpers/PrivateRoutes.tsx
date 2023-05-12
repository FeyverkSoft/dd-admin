import * as React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { TokenStorage } from '../core/TokenStorage';

export const PrivateRoute = ({ component, ...rest }: RouteProps) => {
    if (!component) {
        throw Error("component is undefined");
    }
    const Component = component;
    const render = (props: RouteComponentProps<any>): (React.ReactNode | Redirect) => {
        return TokenStorage.isAuthenticated() ?
            <Component {...rest} {...props} /> :
            <Redirect
                exact
                strict
                children
                to={{ pathname: '/auth' }} />
    };

    return (<Route {...rest} render={render} />);
}


export const NotPrivateRoute = ({ component, ...rest }: RouteProps) => {
    if (!component) {
        throw Error("component is undefined");
    }
    const Component = component;
    const render = (props: RouteComponentProps<any>): (React.ReactNode | Redirect) => {
        return TokenStorage.isAuthenticated() ?
            <Redirect
                exact={rest.exact}
                strict={rest.strict}
                children={rest.children}
                to={{ pathname: '/' }}
            />
            :
            <Component {...rest} {...props} />
    };

    return (<Route {...rest} render={render} />);
}