import * as React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps, LinkProps, NavLink, Link, match } from 'react-router-dom';
import * as History from 'history';
import { TokenStorage } from '../core/TokenStorage';
import { connect } from 'react-redux';
import { IStore } from './store';

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
    isActive?<P extends { [K in keyof P]?: string }>(match: match<P>, location: History.Location): boolean;
    location?: History.Location;
    [id: string]: any;
}

const _PrivateNavLink = ({ ...props }: ILinkProps): ReturnType<NavLink<any>> =>
    props.isAuth || TokenStorage.isAuthenticated()
        ? <NavLink  {...props} exact />
        : null;
export const PrivateNavLink = connect(
    (state: IStore) => {
        return { isAuth: state.auth.isAuth }
    }
)(_PrivateNavLink)

const _PrivateLink = ({ ...props }: ILinkProps): ReturnType<NavLink<any>> =>
    props.isAuth || TokenStorage.isAuthenticated()
        ? <Link  {...props} />
        : null;
export const PrivateLink = connect(
    (state: IStore) => {
        return { isAuth: state.auth.isAuth }
    }
)(_PrivateLink)

const _OnlyPublicNavLink = ({ ...props }: ILinkProps): ReturnType<NavLink<any>> =>
    props.isAuth || TokenStorage.isAuthenticated()
        ? null
        : <NavLink  {...props} exact />;
export const OnlyPublicNavLink = connect(
    (state: IStore) => {
        return { isAuth: state.auth.isAuth }
    }
)(_OnlyPublicNavLink)


const _OnlyPublicLink = ({ ...props }: ILinkProps): ReturnType<NavLink<any>> =>
    props.isAuth || TokenStorage.isAuthenticated()
        ? null
        : <Link  {...props} />;

export const OnlyPublicLink = connect(
    (state: IStore) => {
        return { isAuth: state.auth.isAuth }
    }
)(_OnlyPublicLink)

