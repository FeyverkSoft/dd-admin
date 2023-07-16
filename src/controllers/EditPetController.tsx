import * as React from 'react';
import { connect } from 'react-redux';
import style from './pets.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet } from '../_reducers/pets/IPet';
import { fetchPet, patchPet } from '../_reducers/pets';
import { Breadcrumb, Button, Form, Input, Upload, UploadFile, UploadProps } from 'antd';
import { Link } from 'react-router-dom';
import i18n from '../core/Lang';
import { Editor } from '../_components/Editor/Editor';
import { TokenStorage } from '../core/TokenStorage';
import { useEffect, useState } from 'react';

const UploadImg = (props: { text: string, value?: string, onChange(value: string): void; }) => {

    const [value, changeValue] = useState(props.value);

    useEffect(() => {
        changeValue(props.value);
    }, [props.value]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList[0] && newFileList[0].status === 'done') {
            let val = `/api/img/${newFileList[0].response.fileId}`;
            changeValue(val)
            props.onChange(val);
            setFileList([]);
        }
    }
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    return <div className={style['img']}>
        <div
            className={style['PetBefAfImg']}
            role="img"
            style={{
                backgroundImage: `url(${props.value})`
            }} />
        <Upload
            action="https://dobrodom.online/api/admin/Documents"
            onChange={onChange}
            fileList={fileList}
            headers={{
                'Authorization': `Bearer ${TokenStorage.getToken()}`
            }}
        >
            <Button icon={<UploadOutlined rev='button' />}><Trans>{props.text}</Trans></Button>
        </Upload>
    </div>
}

interface Props extends RouteComponentProps<any> {
    isLoading: boolean;
    id: string;
    result: IPet;
    loadData(id: string): void;
    saveData(id: string,
        beforePhotoLink?: string,
        afterPhotoLink?: string,
        mdShortBody?: string,
        mdBody?: string): void;
}
export class _EditPetController extends React.Component<Props> {
    changeImgBefore = (value: string) => {
        let { result } = this.props;
        this.props.saveData(result.id, value, result.afterPhotoLink, result.mdShortBody, result.mdBody);
    };

    changeImgAfter = (value: string) => {
        let { result } = this.props;
        this.props.saveData(result.id, result.beforePhotoLink, value, result.mdShortBody, result.mdBody);
    };

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
                    <div className={style["img-wrapper"]}>
                        <UploadImg text='Pet.UploadBeforePhotoLink'
                            value={this.props.result.beforePhotoLink}
                            onChange={this.changeImgBefore} />
                        <UploadImg text='Pet.UploadAfterPhotoLink'
                            value={this.props.result.afterPhotoLink}
                            onChange={this.changeImgAfter} />
                    </div>
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
        },
        saveData: (id: string,
            beforePhotoLink?: string,
            afterPhotoLink?: string,
            mdShortBody?: string,
            mdBody?: string) => {
            dispatch(patchPet({
                id: id,
                beforePhotoLink: beforePhotoLink,
                afterPhotoLink: afterPhotoLink,
                mdShortBody: mdShortBody,
                mdBody: mdBody,
            }));
        },/*,
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
