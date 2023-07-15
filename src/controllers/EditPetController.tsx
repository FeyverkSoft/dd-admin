import * as React from 'react';
import { connect } from 'react-redux';
import style from './pets.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined, EditOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet, PetGender, PetGenders, PetState, PetStates, PetType, PetTypes } from '../_reducers/pets/IPet';
import { fetchPets, changeStatus, changeGender, changeType, fetchPet } from '../_reducers/pets';
import { Breadcrumb, Row, Col, Button, Tooltip, Table, Select, Space, Form, Input } from 'antd';
import type { SelectProps } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/lib/input/Search';
import i18n from '../core/Lang';
import memoize from 'lodash.memoize';
import { EditableSelect, IItem } from '../_components/EditableSelect';
import TextArea from 'antd/es/input/TextArea';
import { Editor } from '../_components/Editor/Editor';


interface Props extends RouteComponentProps<any> {
    isLoading: boolean;
    id: string;
    result: IPet;
    loadData(id: string): void;
}
export class _EditPetController extends React.Component<Props> {
    componentDidMount() {
        this.props.loadData(this.props.id);
    }

    render() {
        return (
            <div>
                <Breadcrumb className={style["bc"]}>
                    <Breadcrumb.Item>
                        <Link to={"/admin/"} >
                            <HomeOutlined rev={'span'} />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={"/admin/pets"} >
                            <Trans>Pets.Pets</Trans>
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={`/admin/pets/${this.props.id}/edit`} >
                            <Trans>{this.props?.result?.name ? this.props.result.name : i18n.t("Pets.Edit")}</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style["pet-edit"]}>
                    <Form
                            initialValues={this.props.result}
                    //onFinish={this.handleSubmit}
                    >
                        <Form.Item
                            label={i18n.t('Pet.Description')}
                            name='mdShortBody'
                            rules={[
                                {
                                    required: true,
                                    message: i18n.t('Pet.DescriptionRequired'),
                                },
                            ]}
                        >
                            <Input
                                placeholder={i18n.t("Pet.Description")}
                            />
                        </Form.Item>
                        <Form.Item
                            label={i18n.t('Pet.Body')}
                            name='mdBody'
                            rules={[
                                {
                                    required: true,
                                    message: i18n.t('Pet.BodyRequired'),
                                },
                            ]}
                        >
                            <Editor value={this.props.result.mdBody}></Editor>
                        </Form.Item>
                    </Form>

                </div>
            </div>
        );
    }
}


const EditPetController = connect((state: IStore, props: Props) => {
    const { pet, isLoading } = state.pets;

    const id = props.match.params.id || hasVal('id');

    return {
        id: id,
        isLoading: isLoading,
        result: pet,
    };
}, (dispatch: Function) => {
    return {
        loadData: (id: string) => {
            dispatch(fetchPet({
                id: id,
                organisationId: '10000000-0000-4000-0000-000000000000',
            }));
        }/*,
        changeStatus: (id: string, value: PetState) => {
            dispatch(changeStatus({
                id: id,
                value: value,
            }));
        },
        changeGender: (id: string, value: PetGender) => {
            dispatch(changeGender({
                id: id,
                value: value,
            }));
        },
        changeType: (id: string, value: PetType) => {
            dispatch(changeType({
                id: id,
                value: value,
            }));
        },*/
    }
})(_EditPetController);

export default EditPetController;
