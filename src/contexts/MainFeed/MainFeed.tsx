import React, { createContext, PropsWithChildren, useEffect, useState } from "react";


import ImageList from "../../components/ImageList";
import Search from "../../components/Search";
import config from "../../config";
import useAuth from "../../hooks/auth";
import { getImages } from "../../services/ImagesService";
import './MainFeed.css';

export interface Image {
    id: string,
    webformatURL: string,
    user: string
}

interface MainFeedContextValue {
    notFoundSearchEntry: string;
    changeNotFoundSearchEntryStatus (notFoundSearchEntry: string): void;
    images: Array<Image>;
    getImages (entry: string): Promise<Array<Image>>;
    changeImagesStatus (images: Array<Image>): void;
}

export const MainFeedContext = createContext<MainFeedContextValue>({
    notFoundSearchEntry: '',
    changeNotFoundSearchEntryStatus: () => {},
    images: [],
    getImages: async () => [],
    changeImagesStatus: () => {},
})

export const MainFeedContextProvider = () => {
    useAuth();
    const [images, setImages] = useState<Array<Image>>([]);
    const [notFoundSearchEntry, setNotFoundSearchEntry] = useState('');
    

    useEffect(() => {
        const initialSearchEntry = config.INITIAL_SEARCH_ENTRY ?? 'politics'
        getImages(initialSearchEntry).then((imagesData) => {
            setImages(imagesData);
            console.log('Succeed to get initial images');
        });
    },[])

    const changeNotFoundSearchEntryStatus = (notFoundSearchEntry: string) => {
        setNotFoundSearchEntry(notFoundSearchEntry);
    }

    const changeImagesStatus = (images: Array<Image>) => {
        setImages(images);
    }

    return (
        <MainFeedContext.Provider value={{images, notFoundSearchEntry, getImages,
            changeNotFoundSearchEntryStatus, changeImagesStatus}}>
            <div>
            </div>
            <div className='ui container'>
                <Search/>
                <ImageList/>
            </div>
        </MainFeedContext.Provider>
    )
}
export default MainFeedContextProvider;