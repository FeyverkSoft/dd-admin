import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Router, Route, Switch, BrowserRouter, useLocation } from 'react-router-dom';
import styles from './app.scss';
import './core/Lang';
import { IStore, NotPrivateRoute, OnlyPublicLink, OnlyPublicNavLink, PrivateNavLink, PrivateRoute, TryCatch } from './_helpers';
import { Button, Layout, Menu, MenuProps, MenuTheme, Spin, theme } from 'antd';
import {
    LogoutOutlined,
    LoginOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    QqOutlined,
} from '@ant-design/icons';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const load = (Component: Function) => (props: any) => (
    <TryCatch>
        <Suspense fallback={<Spin tip="Loading" />}>
            <Component {...props} />
        </Suspense>
    </TryCatch>
);


const NotFoundController = load(lazy(() => import("./controllers/NotFoundController")));
const AuthController = load(lazy(() => import("./controllers/AuthController")));
const LogoutController = load(lazy(() => import("./controllers/LogoutController")));
const PetsController = load(lazy(() => import("./controllers/PetsController")));

const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem => {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const onlyPublicItems: MenuItem[] = [
    getItem(<OnlyPublicNavLink to="/admin/auth">
        <Trans>Auth.Auth</Trans>
    </OnlyPublicNavLink>, '/admin/auth', <LoginOutlined />),
];

const privateItems: MenuItem[] = [
    getItem(<PrivateNavLink to="/admin/logout">
        <Trans>Auth.Logout</Trans>
    </PrivateNavLink>, '/admin/logout', <LogoutOutlined />),
    
    getItem(<PrivateNavLink to="/admin/pets">
        <Trans>Pets.Pets</Trans>
    </PrivateNavLink>, '/admin/pets', <QqOutlined />),
];


const _MyApp = (props: { isAuth: boolean }) => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false);
    const [mtheme, setTheme] = useState<MenuTheme>('dark');
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    let items: MenuItem[] = [];
    if (props.isAuth) {
        items.push(...privateItems);
    } else {
        items.push(...onlyPublicItems);
    }


    const [selectedKey, setSelectedKey] = useState(items.find(_item => location.pathname.startsWith(_item?.key?.toString()))?.key?.toString())

    useEffect(() => {
        setSelectedKey(items.find(_item => location.pathname.startsWith(_item?.key?.toString()))?.key?.toString())
    }, [items, location])

    return <div className={`flex-vertical ${styles['app']}`} style={{ width: '100%' }}>
        <div className={"body"}>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider trigger={null} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <Menu theme={mtheme} selectedKeys={[selectedKey]} mode="inline" items={items} />
                </Sider>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <TryCatch>
                        <Switch>
                            <NotPrivateRoute path='/admin/auth' component={AuthController} />
                            <PrivateRoute path='/admin/logout' component={LogoutController} />
                            <PrivateRoute path='/admin/pets' component={PetsController} />
                            <Route component={NotFoundController} />
                        </Switch>
                    </TryCatch>
                </Layout>
            </Layout>
        </div>
    </div>
}

export const MyApp = connect(
    (state: IStore) => {
        return { isAuth: state.auth.isAuth }
    }
)(_MyApp)