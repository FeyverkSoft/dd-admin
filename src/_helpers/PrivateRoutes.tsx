import * as React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps, LinkProps, NavLink, Link } from 'react-router-dom';
import * as History from 'history';
import * as H from 'history';
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



interface ILinkProps extends LinkProps {
    isHidden?: Function
    activeClassName?: string;
    isActive?<P>(match: match<P>, location: History.Location): boolean;
    location?: History.Location;
    [id: string]: any;
}

export const PrivateNavLink = ({ ...props }: ILinkProps): ReturnType<NavLink<H.LocationState>> =>
    TokenStorage.isAuthenticated()
        ? <NavLink  {...props} exact />
        : null;

export class PrivateLink extends React.Component<ILinkProps>{
    render() {
        return (
            TokenStorage.isAuthenticated()
                ? <Link {...this.props} />
                : null
        )
    }
}

export const OnlyPublicNavLink = ({ ...props }: ILinkProps): ReturnType<NavLink<H.LocationState>> =>
    TokenStorage.isAuthenticated()
        ? null
        : <NavLink  {...props} exact />;

export class OnlyPublicLink extends React.Component<ILinkProps>{
    render() {
        return (
            TokenStorage.isAuthenticated()
                ? null
                : <Link {...this.props} />
        )
    }
}


