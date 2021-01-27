// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {Emoji} from 'mattermost-redux/types/emojis';

import {FormattedMessage} from 'react-intl';

import {Tooltip} from 'react-bootstrap';

import {If, Then, Else} from 'react-if';

import OverlayTrigger from 'components/overlay_trigger';

interface PostEmojiProps {
    name: string;
    imageUrl: string;
    userId: string;
    viewerUserId: string;
    emoji: Emoji | undefined;
    clientFuncs: {
        checkEmojiAccess: (userId: string, emoji: Emoji|undefined) => Promise<boolean>;
        savePrivateEmoji: (userId: string, emoji: Emoji|undefined) => Promise<any>;
    };
}

interface PostEmojiState {
    canSenderAccess: boolean;
    canViewerAccess: boolean;
    showMenu: boolean;
}
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        alt?: string;
    }
}

export default class PostEmoji extends React.PureComponent<PostEmojiProps, PostEmojiState> {
    buttonRef: React.RefObject<PostEmoji>
    constructor(props: PostEmojiProps) {
        super(props);
        this.buttonRef = React.createRef();
    }

    state = {
        canSenderAccess: false,
        canViewerAccess: false,
        showMenu: false
    }

    componentDidMount() {
        this.checkImage();
    }
    checkImage = async () => {
        try {
            const canSenderAccess = await this.props.clientFuncs.checkEmojiAccess(this.props.userId, this.props.emoji);
            const canViewerAccess = await this.props.clientFuncs.checkEmojiAccess(this.props.viewerUserId, this.props.emoji);
            this.setState({canSenderAccess, canViewerAccess});
        } catch (e) {
            this.setState({canSenderAccess: false, canViewerAccess: false});
        }
    }

    saveImage = async () => {
        if (!this.state.canViewerAccess) {
            await this.props.clientFuncs.savePrivateEmoji(this.props.viewerUserId, this.props.emoji);
            await this.checkImage();
        }
    }

    public render() {
        const emojiText = ':' + this.props.name + ':';

        if (!this.state.canSenderAccess || !this.props.imageUrl) {
            return emojiText;
        }

        return (

            <OverlayTrigger

                // className='hidden-xs'
                delayShow={500}
                placement='top'
                overlay={
                    <Tooltip
                        id='dotmenu-icon-tooltip'
                        className='hidden-xs'
                    >
                        {emojiText}<br/>
                        <If condition={this.state.canViewerAccess}>
                            <Then>
                                <FormattedMessage
                                    id='post_emoji.saved'
                                    defaultMessage='Added'
                                />
                            </Then>
                            <Else>
                                <FormattedMessage
                                    id='post_emoji.not_saved'
                                    defaultMessage='Click to Add'
                                />
                            </Else>
                        </If>
                    </Tooltip>}
                rootClose={true}
            >
                <span
                    alt={emojiText}
                    className='emoticon'
                    style={{
                        backgroundImage: 'url(' + this.props.imageUrl + ')',
                        cursor: 'pointer'
                    }}
                    onClick={this.saveImage.bind(this)}
                >
                    {emojiText}
                </span>
            </OverlayTrigger>

        );
    }
}
