import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Router, Route, Switch, BrowserRouter, useLocation } from 'react-router-dom';
import styles from './app.scss';
import './core/Lang';
import { NotPrivateRoute, OnlyPublicLink, OnlyPublicNavLink, TryCatch } from './_helpers';
import { Button, Layout, Menu, MenuProps, MenuTheme, Spin, theme } from 'antd';
import {
    LoginOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons';
import i18next from 'i18next';
import { Trans } from 'react-i18next';

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

const items: MenuItem[] = [
    getItem(<OnlyPublicNavLink to="/auth">
        <Trans>Auth.Auth</Trans>
    </OnlyPublicNavLink>, '/auth', <LoginOutlined />),
];


export const MyApp = () => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false);
    const [mtheme, setTheme] = useState<MenuTheme>('dark');
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [selectedKey, setSelectedKey] = useState(items.find(_item => location.pathname.startsWith(_item.key))?.key)

    useEffect(() => {
        setSelectedKey(items.find(_item => location.pathname.startsWith(_item.key))?.key)
    }, [location])

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
                            <NotPrivateRoute path='/auth' component={AuthController} />
                            <Route component={NotFoundController} />
                        </Switch>
                    </TryCatch>
                </Layout>
            </Layout>
        </div>
    </div>
}