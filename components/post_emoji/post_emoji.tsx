// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import { checkEmojiAccess } from 'casualchat/CasualChatClient';
import { Emoji } from 'mattermost-redux/types/emojis';
import OverlayTrigger from 'components/overlay_trigger';
import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';
import DotsHorizontalIcon from 'components/widgets/icons/dots_horizontal';
import Pluggable from 'plugins/pluggable';
import DotMenu from 'components/dot_menu/dot_menu'
import { Modal } from 'react-bootstrap';
import * as Utils from 'utils/utils.jsx';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'react-bootstrap';
import Constants from 'utils/constants';
import { If, Then, Else } from 'react-if';

const MENU_BOTTOM_MARGIN = 80;

interface PostEmojiProps {
    name: string;
    imageUrl: string;
    userId: string;
    emoji: Emoji | undefined;
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
            const canSenderAccess = await checkEmojiAccess(this.props.userId, this.props.emoji);
            this.setState({ canSenderAccess });
        } catch (e) {
            console.log(e);
            this.setState({ canSenderAccess: false });
        }

    }
    // onHide(){
    //     this.setState({showMenu: false});
    // }

    // refCallback = (menuRef: Menu) => {
    //     if (menuRef && this.buttonRef) {
    //         const rect = menuRef.rect();
    //         const buttonRect = this.buttonRef.current.getBoundingClientRect();
    //         const y = typeof buttonRect.y === 'undefined' ? buttonRect.top : buttonRect.y;
    //         const windowHeight = window.innerHeight;

    //         const totalSpace = windowHeight - MENU_BOTTOM_MARGIN;
    //         const spaceOnTop = y - Constants.CHANNEL_HEADER_HEIGHT;
    //         const spaceOnBottom = (totalSpace - (spaceOnTop + Constants.POST_AREA_HEIGHT));

    //         this.setState({
    //             openUp: (spaceOnTop > spaceOnBottom),
    //             width: rect.width,
    //         });
    //     }
    // }

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
                overlay={<Tooltip
                    id='dotmenu-icon-tooltip'
                    className='hidden-xs'
                >
                    {emojiText}<br />
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
                        cursor: "pointer"
                    }}

                >
                    {emojiText}
                </span>
            </OverlayTrigger>




        );
    }
}
