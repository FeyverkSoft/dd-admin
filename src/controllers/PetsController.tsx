import * as React from 'react';
import { connect } from 'react-redux';
import style from './pets.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet, PetGender, PetGenders, PetState, PetStates, PetType, PetTypes } from '../_reducers/pets/IPet';
import { fetchPets, pets } from '../_reducers/pets';
import { Breadcrumb, Row, Col, Button, Tooltip, Table, Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/lib/input/Search';
import i18n from '../core/Lang';
import memoize from 'lodash.memoize';
import { EditableSelect, IItem } from '../_components/EditableSelect';


const DEFAULT_S_FILTERS: Array<PetState> = ['alive', 'death', 'adopted', 'critical', 'wanted'];

interface Props extends RouteComponentProps<any> {
    limit?: number;
    offset?: number;
    q?: string;
    petStatuses?: Array<PetState>;
    genders?: Array<PetGender>;
    petTypes?: Array<PetType>,
    isLoading: boolean;
    total: number;
    result: IPet[],
    loadData(limit: number, offset: number, q: string, petStatuses: Array<PetState>, genders: Array<PetGender>, types: Array<PetType>): void;
}
export class _PetsController extends React.Component<Props> {
    componentDidMount() {
        this.props.loadData(
            this.props.limit,
            this.props.offset,
            this.props.q,
            this.props.petStatuses?.length > 0 ? this.props.petStatuses : DEFAULT_S_FILTERS,
            this.props.genders?.length > 0 ? this.props.genders : PetGenders,
            this.props.petTypes?.length > 0 ? this.props.petTypes : PetTypes,
        );
    }

    paginationOnChange = (page: number, pageSize: number) => {
        this.updateHash(page);
    };

    handleStatusesChange = (value: string[]) => {
        this.updateHash(
            (this.props.offset / this.props.limit) + 1,
            value || DEFAULT_S_FILTERS,
            this.props.genders || PetGenders,
            this.props.petTypes || PetTypes,
            this.props.q,
        );
    }
    handleTypesChange = (value: string[]) => {
        this.updateHash(
            (this.props.offset / this.props.limit) + 1,
            this.props.petStatuses || DEFAULT_S_FILTERS,
            this.props.genders || PetGenders,
            value || PetTypes,
            this.props.q,
        );
    }
    handleGendersChange = (value: string[]) => {
        this.updateHash(
            (this.props.offset / this.props.limit) + 1,
            this.props.petStatuses || DEFAULT_S_FILTERS,
            value || PetGenders,
            this.props.petTypes || PetTypes,
            this.props.q,
        );
    }

    onSearch = (value: string, event?: any) => {
        if (this.props.q != value) {
            this.updateHash(1, this.props.petStatuses, this.props.genders, this.props.petTypes, value);
        }
    };

    updateHash = (page: number,
        petStatuses?: PetState[] | undefined,
        genders?: PetGender[] | undefined,
        types?: PetType[] | undefined,
        search?: string | undefined) => {
        const { limit } = this.props;
        const offset = limit * (page - 1);
        let hash = `#limit=${limit}` +
            `&offset=${offset}`;

        if (petStatuses && petStatuses.length !== 0)
            hash += `&petStatuses=${petStatuses?.join(',')}`;

        if (genders && genders.length !== 0)
            hash += `&genders=${genders?.join(',')}`
        if (types && types.length !== 0)
            hash += `&types=${types?.join(',')}`
        if (search && search.length !== 0)
            hash += `&q=${search}`;

        this.props.history.push({
            hash: hash,
        });
        this.props.loadData(
            limit,
            offset,
            search,
            petStatuses?.length > 0 ? petStatuses : DEFAULT_S_FILTERS,
            genders?.length > 0 ? genders : PetGenders,
            types?.length > 0 ? types : PetTypes,
        );
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
                </Breadcrumb>
                <div className={style["pets"]}>
                    <Row gutter={[25, 25]}>
                        <Col xs={15} sm={15} md={12} lg={12} xl={8}>
                            {<Search
                                placeholder="введите текст для поиска"
                                enterButton='search'
                                onSearch={this.onSearch}
                            />}
                        </Col>
                        <Col xs={10} sm={9} md={6} lg={5} xl={5}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                allowClear
                                placeholder={i18n.t('Pets.State')}
                                defaultValue={DEFAULT_S_FILTERS}
                                onChange={this.handleStatusesChange}
                                options={PetStates.map((_) => {
                                    return { value: _, label: i18n.t(`PetStates.${_.toLowerCase()}`) }
                                })}
                            />
                        </Col>
                        <Col xs={10} sm={9} md={6} lg={5} xl={5}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                allowClear
                                placeholder={i18n.t('Pets.Gender')}
                                defaultValue={PetGenders}
                                onChange={this.handleGendersChange}
                                options={PetGenders.map((_) => {
                                    return { value: _, label: i18n.t(`PetGenders.${_.toLowerCase()}`) }
                                })}
                            />
                        </Col>
                        <Col xs={10} sm={9} md={6} lg={5} xl={4}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                allowClear
                                placeholder={i18n.t('Pets.Type')}
                                defaultValue={PetTypes}
                                onChange={this.handleTypesChange}
                                options={PetTypes.map((_) => {
                                    return { value: _, label: i18n.t(`PetTypes.${_.toLowerCase()}`) }
                                })}
                            />
                        </Col>
                        <Col xs={4} sm={3} md={2} lg={2} xl={1}>
                            {<Button
                                type='primary'
                            // onClick={this.toggleAddPetsModal}
                            >
                                <Trans>Pets.Add</Trans>
                            </Button>}
                        </Col>
                    </Row>
                    <Row gutter={[1, 1]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {<Table
                                size='middle'
                                rowKey="id"
                                columns={[
                                    {
                                        title: i18n.t('Pets.Name'),
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: i18n.t('Pets.State'),
                                        dataIndex: 'petState',
                                        key: 'petState',
                                        render: memoize((value: string, record: IPet) => {
                                            return {
                                                props: {
                                                    className: `${style[record.petState.toLocaleLowerCase()]}`
                                                },
                                                children: <div>
                                                    <Col>{<EditableSelect
                                                        value={value}
                                                        items={PetStates.map((_): IItem => {
                                                            return { value: _, description: i18n.t(`PetStates.${_.toLowerCase()}`) }
                                                        })}
                                                        onSave={(value: string) => { }}
                                                    />}
                                                    </Col>
                                                </div>
                                            }
                                        }, (it, p) => JSON.stringify(p))
                                    },
                                    {
                                        title: i18n.t('Pets.Type'),
                                        dataIndex: 'type',
                                        key: 'type',
                                        render: memoize((value: string, record: IPet) => {
                                            return {
                                                props: {
                                                    className: `${style[record.type.toLocaleLowerCase()]}`
                                                },
                                                children: <div>
                                                    <Col>{<EditableSelect
                                                        value={value}
                                                        items={PetTypes.map((_): IItem => {
                                                            return { value: _, description: i18n.t(`PetTypes.${_.toLowerCase()}`) }
                                                        })}
                                                        onSave={(value: string) => { }}
                                                    />}
                                                    </Col>
                                                </div>
                                            }
                                        }, (it, p) => JSON.stringify(p))
                                    },
                                    {
                                        title: i18n.t('Pets.Gender'),
                                        dataIndex: 'gender',
                                        key: 'gender',
                                        sorter: (a: IPet, b: IPet) => {

                                            return a.gender === b.gender ? 0 : (a.gender > b.gender ? 1 : -1);
                                        },
                                        render: memoize((value: string, record: IPet) => {
                                            return {
                                                props: {
                                                    className: `${style[record.gender.toLocaleLowerCase()]}`
                                                },
                                                children: <div>
                                                    <Col>{<EditableSelect
                                                        value={value}
                                                        items={PetGenders.map((_): IItem => {
                                                            return { value: _, description: i18n.t(`PetGenders.${_.toLowerCase()}`) }
                                                        })}
                                                        onSave={(value: string) => { }}
                                                    />}
                                                    </Col>
                                                </div>
                                            }
                                        }, (it, p) => JSON.stringify(p))
                                    },
                                ]}
                                pagination={{
                                    pageSize: 15,
                                    total: this.props.total,
                                    onChange: this.paginationOnChange
                                }}
                                //onChange={this.onChange}
                                loading={this.props.isLoading}
                                bordered={false}
                                dataSource={this.props.result}
                            />}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}


const PetsController = connect((state: IStore, props: Props) => {
    const { total, items, isLoading } = state.pets;

    const limit = Number(props.match.params.limit || hasVal('limit') || 15);
    const offset = Number(props.match.params.offset || hasVal('offset') || 0);
    const query = props.match.params.q || hasVal('q') || "";

    const petStatuses = (props.match.params.petStatuses || hasVal('petStatuses') || "").split(',').filter((_: string) => _ != '');
    const genders = (props.match.params.genders || hasVal('genders') || "").split(',').filter((_: string) => _ != '');;
    const petTypes = (props.match.params.petTypes || hasVal('types') || "").split(',').filter((_: string) => _ != '');;

    return {
        petStatuses: petStatuses,
        petTypes: petTypes,
        genders: genders,
        isLoading: isLoading,
        limit: limit,
        offset: offset,
        total: total ?? 0,
        query: query,
        result: items,
    };
}, (dispatch: Function) => {
    return {
        loadData: (limit: number, offset: number, q: string, petStatuses: Array<PetState>, genders: Array<PetGender>, types: Array<PetType>) => {
            dispatch(fetchPets({
                limit,
                offset,
                organisationId: '10000000-0000-4000-0000-000000000000',
                text: q,
                petGenders: genders,
                petStatuses: petStatuses,
                types: types
            }));
        }
    }
})(_PetsController);

export default PetsController;
