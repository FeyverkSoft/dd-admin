import React, { useEffect, useState } from 'react';
import style from './module.scss';
import { HomeOutlined, UploadOutlined } from '@ant-design/icons';
import { Store, useStepsForm } from 'sunflower-antd';
import { Steps, Input, Button, Form, Result, Select, Upload, UploadFile, UploadProps } from 'antd';
import i18n from '../../core/Lang';
import layout from 'antd/es/layout';
import { PetGenders, PetTypes } from '../../_reducers/pets/IPet';
import { Editor } from '../Editor/Editor';
import { TokenStorage } from '../../core/TokenStorage';
import { Trans } from 'react-i18next';
import { Config } from '../../core';

const { Step } = Steps;


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
            action={Config.BuildUrl("/admin/Documents")}
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

export interface PetCreateFormProps {
    onSubmit?: (value: Store) => void;
}

export const PetCreateForm: React.FC<PetCreateFormProps> = ({ onSubmit }) => {
    const {
        form,
        current,
        gotoStep,
        stepsProps,
        formProps,
        submit,
        formLoading,
    } = useStepsForm({
        async submit(values) {
            debugger;
            onSubmit(values);
        },
        total: 3,
    });

    const formList = [
        <>
            <Form.Item
                label={i18n.t('Pet.Name')}
                name='name'
                rules={[
                    {
                        required: true,
                        message: i18n.t('Pet.NameRequired'),
                    },
                ]}
            >
                <Input
                    placeholder={i18n.t("Pet.Name")}
                />
            </Form.Item>
            <Form.Item
                label={i18n.t('Pet.Type')}
                name='type'
                rules={[
                    {
                        required: true,
                        message: i18n.t('Pet.TypeRequired'),
                    },
                ]}
            >
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder={i18n.t('Pets.Type')}
                    defaultValue={PetTypes}
                    options={PetTypes.map((_) => {
                        return { value: _, label: i18n.t(`PetTypes.${_.toLowerCase()}`) }
                    })}
                />
            </Form.Item>
            <Form.Item
                label={i18n.t('Pet.Gender')}
                name='gender'
                rules={[
                    {
                        required: true,
                        message: i18n.t('Pet.GenderRequired'),
                    },
                ]}
            >
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder={i18n.t('Pets.Gender')}
                    defaultValue={PetGenders}
                    options={PetGenders.map((_) => {
                        return { value: _, label: i18n.t(`PetGenders.${_.toLowerCase()}`) }
                    })}
                />

            </Form.Item>
            <Form.Item >
                <Button onClick={() => gotoStep(current + 1)}>Next</Button>
            </Form.Item>
        </>,

        <>
            <Form.Item
                name='UploadBeforePhotoLink'
            >
                <UploadImg text='Pet.UploadBeforePhotoLink' onChange={() => { }} />
            </Form.Item>
            <Form.Item
                name='UploadBeforePhotoLink'
            >
                <UploadImg text='Pet.UploadAfterPhotoLink'
                    onChange={() => { }}
                />

            </Form.Item>
            <Form.Item>
                <Button onClick={() => gotoStep(current + 1)}>Next</Button>
                <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
            </Form.Item>
        </>,
        <>
            <Form.Item
                label={i18n.t('Pet.Description')}
                name='mdShortBody'
                style={{ display: current == 2 ? 'block' : 'none' }}
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
                style={{ display: current == 2 ? 'block' : 'none' }}
                rules={[
                    {
                        required: true,
                        message: i18n.t('Pet.BodyRequired'),
                    },
                ]}
            >
                <Editor />
            </Form.Item>
            <Form.Item>
                <Button
                    style={{ marginRight: 10 }}
                    type="primary"
                    loading={formLoading}
                    onClick={() => {
                        submit().then(result => {
                            if (result === 'ok') {
                                gotoStep(current + 1);
                            }
                        });
                    }}
                >
                    Submit
                </Button>
                <Button onClick={() => gotoStep(current - 1)}>Prev</Button>
            </Form.Item>
        </>
    ];

    return (
        <div>
            <Steps {...stepsProps}>
                <Step title={i18n.t('CreatePet.EnterName')} />
                <Step title={i18n.t('CreatePet.LoadPhoto')} />
                <Step title={i18n.t('CreatePet.EnterDescription')} />
            </Steps>

            <div style={{ marginTop: 60 }}>
                <Form {...layout} {...formProps}>
                    {formList[current]}
                </Form>

                {current === 3 && (
                    <Result
                        status="success"
                        title="Submit is succeed!"
                    />
                )}
            </div>
        </div>
    );
}