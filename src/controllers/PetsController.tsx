import * as React from 'react';
import { connect } from 'react-redux';
import style from './pets.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet, PetGender, PetGenders, PetState, PetStates, PetTypes } from '../_reducers/pets/IPet';
import { fetchPets, pets } from '../_reducers/pets';
import { Breadcrumb, Row, Col, Button, Tooltip, Table } from 'antd';
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
    isLoading: boolean;
    total: number;
    result: IPet[],
    loadData(limit: number, offset: number, q: string, petStatuses: Array<PetState>, genders: Array<PetGender>): void;
}
export class _PetsController extends React.Component<Props> {

    componentDidMount() {
        this.props.loadData(this.props.limit, this.props.offset, this.props.q, this.props.petStatuses, this.props.genders);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.q != this.props.q ||
            prevProps.limit != this.props.limit ||
            prevProps.offset != this.props.offset) {
            this.props.loadData(this.props.limit, this.props.offset, this.props.q, this.props.petStatuses, this.props.genders);
        }
    }

    paginationOnChange = (page: number, pageSize: number) => {
        this.updateHash(page);
    };

    onSearch = (value: string, event?: any) => {
        if (this.props.q != value) {
            this.updateHash(this.props.offset / (this.props.limit ?? 1) + 1, this.props.petStatuses, this.props.genders, value);
        }
    };

    updateHash = (page: number,
        petStatuses?: PetState[] | undefined,
        genders?: PetGender[] | undefined,
        search?: string | undefined) => {
        const { limit } = this.props;
        const offset = limit * (page - 1);
        let hash = `#limit=${limit}` +
            `&offset=${offset}`;
        if (petStatuses)
            hash += `&petStatuses=${petStatuses?.join(',')}`;
        if (genders)
            hash += `&genders=${genders?.join(',')}`
        if (search)
            hash += `&q=${search}`;

        this.props.history.push({
            hash: hash,
        });
        this.props.loadData(limit, offset, search, petStatuses || DEFAULT_S_FILTERS, genders || PetGenders);
    }

    render() {
        return (
            <div>
                <Breadcrumb className={style["bc"]}>
                    <Breadcrumb.Item>
                        <Link to={"/admin/"} >
                            <HomeOutlined />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to={"/admin/pets"} >
                            <Trans>Pets.Pets</Trans>
                        </Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className={style["pets"]}>
                    <Row gutter={[16, 16]}>
                        <Col xs={19} sm={19} md={21} lg={22} xl={23}>
                            {<Search
                                placeholder="введите текст для поиска"
                                enterButton='search'
                                onSearch={this.onSearch}
                            />}
                        </Col>
                        <Col xs={5} sm={5} md={3} lg={2} xl={1}>
                            {/* <Button
                                    onClick={this.toggleAddPetsModal}
                                >
                                    Add
                            </Button>*/}
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xl={24}>
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
    const { total, items } = state.pets;

    const limit = Number(props.match.params.limit || hasVal('limit') || 15);
    const offset = Number(props.match.params.offset || hasVal('offset') || 0);
    const query = props.match.params.q || hasVal('q') || "";

    return {
        img: "./img/varia.jpg",
        //isLoading: isLoading,
        limit: limit,
        offset: offset,
        total: total ?? 0,
        query: query,
        result: items,
    };
}, (dispatch: Function) => {
    return {
        loadData: (limit: number, offset: number, q: string, petStatuses: Array<PetState>, genders: Array<PetGender>) => {
            dispatch(fetchPets({
                limit,
                offset,
                organisationId: '10000000-0000-4000-0000-000000000000',
                text: q,
                petGenders: genders,
                petStatuses: petStatuses
            }));
        }
    }
})(_PetsController);

export default PetsController;
