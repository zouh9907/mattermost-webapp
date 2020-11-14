// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

interface PostEmojiProps {
    name: string;
    imageUrl: string;
}
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        alt?: string;
    }
}

export default class PostEmoji extends React.PureComponent<PostEmojiProps, {}> {
    state={
        err: false
    }

    // componentDidMount(){
    //     this.checkImage();
    // }
    // checkImage = async ()=>{
    //     try{
    //         const response = await Client4.doFetch<any>(
    //             this.props.imageUrl,
    //             {method: 'get'},
    //         );
    //         console.log(response);
    //         if('error' in response){
    //             this.setState({err:true});
    //         }
    //     }catch(e){
    //         console.log(e);
    //         this.setState({err:false});
    //     }

    // }
    public render() {
        const emojiText = ':' + this.props.name + ':';

        if (this.state.err || !this.props.imageUrl) {
            return emojiText;
        }

        return (
            <span
                alt={emojiText}
                className='emoticon'
                title={emojiText}
                style={{backgroundImage: 'url(' + this.props.imageUrl + ')'}}
            >
                {emojiText}
            </span>
        );
    }
}
