import * as React from 'react';
import { Card, Breadcrumb, Tabs } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import style from './auth.module.scss';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { LoginForm } from '../_components/LoginForm/LoginForm';

export default class AuthController extends React.Component {
    render() {
        return (
            <div>
                <Breadcrumb className={style['bc']}>
                    <Breadcrumb.Item>
                        <Link to={"/admin/"} >
                            <HomeOutlined />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={"/admin/auth"} >
                            <Trans>Auth.Auth</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style['auth']}>
                    <Card
                        title={<Trans>Auth.Form</Trans>}
                        style={{ width: '500px' }}
                    >
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Auth" key="1">
                                <LoginForm />
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
        );
    }
}