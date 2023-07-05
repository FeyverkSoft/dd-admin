import * as React from 'react';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { hasVal } from '../core/ObjCore';


interface IHash {
    limit?: string,
    offset?: string,
    petId?: string,
    tag?: string,
}
interface Props extends RouteComponentProps<IHash> {
    img?: string;
    isFresh: boolean;
    isLoading: boolean;
    limit: number;
    offset: number;
    total: number;
    petId?: string,
    tag?: string,
    loadData(limit: number, offset: number, petId?: string, tag?: string): void;
}
export class _PetsController extends React.Component<Props> {
    componentDidMount() {
    }

    componentDidUpdate(prevProps: Props) {
        const { limit, offset, tag, petId } = this.props;
        if (limit !== prevProps.limit ||
            offset !== prevProps.offset ||
            petId !== prevProps.petId ||
            tag !== prevProps.tag) {
            this.props.loadData(limit, offset, petId, tag);
        }
    }

}