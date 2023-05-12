import * as React from 'react';
//import { LoginForm } from '../_components/LoginForm/LoginForm';
import { Card, Breadcrumb, Tabs } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import style from './auth.module.scss';
//import { Content } from '../_components/Content/Content';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';

export default class AuthController extends React.Component {
    render() {
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to={"/"} >
                            <HomeOutlined />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={"/auth"} >
                            <Trans>Auth.Auth</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style['auth']}>
                    <Card
                        title='Authorize form'
                        style={{ width: '500px' }}
                    >
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Auth" key="1">
                                {/*<LoginForm />*/}
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
        );
    }
}