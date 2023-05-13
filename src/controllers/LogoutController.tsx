import * as React from 'react';
import { Card, Breadcrumb, Tabs } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import style from './auth.module.scss';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { LogAuthForm } from '../_components/LoginForm/LogAuthForm';

export default class LogoutController extends React.Component {
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
                        <Link to={"/admin/logout"} >
                            <Trans>Auth.Logout</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style['auth']}>
                    <Card
                        title={<Trans>Auth.Form</Trans>}
                        style={{ width: '500px' }}
                    >
                        <LogAuthForm />
                    </Card>
                </div>
            </div>
        );
    }
}