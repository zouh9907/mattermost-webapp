// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import DeleteModalTrigger from 'components/delete_modal_trigger';
import WarningIcon from 'components/widgets/icons/fa_warning_icon';
import {If, Then, Else} from 'react-if';

export default class DeleteEmoji extends DeleteModalTrigger {
    static propTypes = {
        onDelete: PropTypes.func.isRequired,
        isPrivate: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool
    }

    get triggerTitle() {
        return (
            <If condition={this.props.isPrivate && !this.props.isOwner}>
                <Then>
                    <FormattedMessage
                        id='emoji_list.remove_access'
                        defaultMessage='Remove Access'
                    />
                </Then>
                <Else>
                    <FormattedMessage
                        id='emoji_list.delete'
                        defaultMessage='Delete'
                    />
                </Else>
            </If>
            
        );
    }

    get modalTitle() {
        return (
            <If condition={this.props.isPrivate && !this.props.isOwner}>
                <Then>
                    <FormattedMessage
                        id='emoji_list.remove_access.confirm.title'
                        defaultMessage='Remove Emoji Access'
                    />
                </Then>
                <Else>
                    <FormattedMessage
                        id='emoji_list.delete.confirm.title'
                        defaultMessage='Delete Emoji'
                    />
                </Else>
            </If>
        );
    }

    get modalMessage() {
        return (
            <div className='alert alert-warning'>
                <WarningIcon additionalClassName='mr-1'/>
                <If condition={this.props.isPrivate && !this.props.isOwner}>
                <Then>
                    <FormattedMessage
                        id='emoji_list.remove_access.confirm.msg'
                        defaultMessage='This action removes your access to the emoji. Are you sure you want to remove it?'
                    />
                </Then>
                <Else>
                    <FormattedMessage
                        id='emoji_list.delete.confirm.msg'
                        defaultMessage='This action permanently deletes the emoji. Are you sure you want to delete it?'
                    />
                </Else>
            </If>
            </div>
        );
    }

    get modalConfirmButton() {
        return (
            <FormattedMessage
                id='emoji_list.delete.confirm.button'
                defaultMessage='Delete'
            />
        );
    }
}
