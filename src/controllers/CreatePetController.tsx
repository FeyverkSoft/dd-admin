import * as React from 'react';
import { connect } from 'react-redux';
import style from './pets.module.scss';
import { useStepsForm } from 'sunflower-antd';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet, PetGenders, PetTypes } from '../_reducers/pets/IPet';
import { fetchPet, patchPet } from '../_reducers/pets';
import { Breadcrumb, Button, Form, FormInstance, Input, Select, Steps, Upload, UploadFile, UploadProps } from 'antd';
import { Link } from 'react-router-dom';
import i18n from '../core/Lang';
import { Editor } from '../_components/Editor/Editor';
import { TokenStorage } from '../core/TokenStorage';
import { createRef, RefObject, useEffect, useState } from 'react';
import { PetCreateForm } from '../_components/NewPetForm/NewPetForm';

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
    saveData(id: string,
        beforePhotoLink?: string,
        afterPhotoLink?: string,
        mdShortBody?: string,
        mdBody?: string): void;
}
export class _CreatePetController extends React.Component<Props, { current: number, afterImg?: string | undefined, beforeImg?: string | undefined }> {
    formRef: RefObject<FormInstance> = createRef<FormInstance>();

    constructor(props: Props) {
        super(props);
        this.state = { current: 0, afterImg: '', beforeImg: '' };
    }

    changeImgBefore = (value: string) => {
        this.setState({
            beforeImg: value,
        });
    };

    changeImgAfter = (value: string) => {
        this.setState({
            afterImg: value,
        });
    };

    handleSubmit = (values: any) => {
        let { result } = this.props;
        this.props.saveData(result.id, result.beforePhotoLink, result.afterPhotoLink, values?.mdShortBody ?? result.mdShortBody, values?.mdBody ?? result.mdBody);
    };

    render() {
        const { current } = this.state;
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
                        <Link to={`/admin/pets/${this.props.id}/new`} >
                            <Trans>{i18n.t("CreatePet.New")}</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style["pet-edit"]}>
                    <PetCreateForm></PetCreateForm>
                </div>
            </div>
        );
    }
}


const CreatePetController = connect((state: IStore, props: Props) => {
    const { isLoading } = state.pets;
    const id = props.match.params.id || hasVal('id');

    return {
        id: id,
        isLoading: isLoading,
        result: {
            id: id,
            name: '',
            mdBody: '',
            mdShortBody: '',
            petState: 'unset',
            gender: 'unset',
            type: 'unset',
        },
    };
}, (dispatch: Function) => {
    return {
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
        },
    }
})(_CreatePetController);

export default CreatePetController;
