import React, { lazy, Suspense } from 'react';
import { Router, Route, Switch, BrowserRouter } from 'react-router-dom';
import styles from './app.scss';
import './core/Lang';
import { NotPrivateRoute, TryCatch } from './_helpers';
import { Spin } from 'antd';

const load = (Component: Function) => (props: any) => (
    <TryCatch>
        <Suspense fallback={<Spin tip="Loading" />}>
            <Component {...props} />
        </Suspense>
    </TryCatch>
);


const NotFoundController = load(lazy(() => import("./controllers/NotFoundController")));
const AuthController = load(lazy(() => import("./controllers/AuthController")));

export const MyApp = () =>
    <div className={`flex-vertical ${styles['app']}`} style={{ width: '100%' }}>
        <div className={"body"}>
            <TryCatch>
                <Switch>
                    <NotPrivateRoute path='/auth' component={AuthController} />
                    <Route component={NotFoundController} />
                </Switch>
            </TryCatch>
        </div>
    </div>
