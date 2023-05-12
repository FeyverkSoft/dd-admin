import * as React from 'react';
import { Trans } from 'react-i18next';


 export default class NotFoundController extends React.Component {
    render() {
        return (
            <div>
                <Trans>page.NotFound</Trans>
                😏
            </div>
        );
    }
}