import * as React from 'react';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';
import { IStore } from '../_helpers';
import { IPet, PetGender, PetState } from '../_reducers/pets/IPet';
import { fetchPets, pets } from '../_reducers/pets';
import { Breadcrumb, Row, Col, Button, Tooltip, Table } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/lib/input/Search';


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
    render() {
        return (
            <div>
                <Breadcrumb>
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
                <div>
                        <Row gutter={[16, 16]}>
                            <Col xs={19} sm={19} md={21} lg={22} xl={23}>
                               {/* <Search
                                    placeholder="введите текст для поиска"
                                    enterButton='search'
                                    onSearch={this.onSearch}
                                />*/}
                            </Col>
                            <Col xs={5} sm={5} md={3} lg={2} xl={1}>
                               {/* <Button
                                    onClick={this.toggleAddStudentModal}
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
                                            title: 'Name',
                                            dataIndex: 'name',
                                            key: 'name',
                                        },
                                        {
                                            title: 'State',
                                            dataIndex: 'petState',
                                            key: 'petState',
                                        },
                                        {
                                            title: 'Type',
                                            dataIndex: 'type',
                                            key: 'type',
                                        },
                                    ]}
                                    pagination={{
                                        pageSize: 15,
                                        total: this.props.total
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

    const limit = Number(props.match.params.limit || hasVal('limit') || 9);
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
        loadData: (limit: number, offset: number, query: string) => {
            dispatch(fetchPets({
                limit,
                offset,
                organisationId: '10000000-0000-4000-0000-000000000000',
                text: query,
            }));
        }
    }
})(_PetsController);

export default PetsController;
