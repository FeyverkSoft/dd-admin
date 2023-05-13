import React from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'antd';
//import { IStore } from '../../_helpers';
import { authService } from '../../_services/auth/auth.service';
import { Trans } from 'react-i18next';
import { IStore } from '../../_helpers';

interface UserFormProps {
    logOut(): void;
}

class _LogAuthForm extends React.Component<UserFormProps, any> {
    handleSubmit = (values: any) => {
        this.props.logOut();
    };

    render() {
        return (
            <Form
                onFinish={this.handleSubmit}
            >
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        <Trans>Auth.Logout</Trans>
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const connectedLogAuthForm = connect<{}, {}, any, IStore>(
    (state: IStore) => {
        return {        };
    },
    (dispatch: Function) => {
        return {
            logOut: () => {
                authService.logOut();
            },
        }
    })(_LogAuthForm);

export { connectedLogAuthForm as LogAuthForm };
