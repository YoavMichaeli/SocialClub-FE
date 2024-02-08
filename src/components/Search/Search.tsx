import React, {useContext, useRef} from 'react';
import { useParams } from 'react-router-dom';

import {MainFeedContext, Image} from "../../contexts/MainFeed";
import './Search.css'


const Search = () => {
    let {page} = useParams();
    const {changeNotFoundSearchEntryStatus, changeImagesStatus, getImages} = useContext(MainFeedContext);
    const inputRef = useRef<any>();

    const onFormSubmit = (event: any) => {
        event.preventDefault();
            getImages(inputRef.current.value).then((imagesData: Array<Image>) => {
                changeImagesStatus(imagesData);
                if (!imagesData.length) {
                    changeNotFoundSearchEntryStatus(inputRef.current.value)
                }
            });
    }

    return <div className='ui container'>
            <form onSubmit={onFormSubmit} className='ui form'>
                <div className='field'>
                    <div className='ui massive icon input'>
                        <input type="text"
                               placeholder='Search something...'
                               ref={inputRef}/>
                        <i className='search icon'> </i>
                    </div>
                </div>
            </form>
        </div>
}

export default Search;