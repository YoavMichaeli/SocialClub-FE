import React, { useContext, useMemo } from "react";


import { MainFeedContext } from "../../contexts/MainFeed";
import "./ImageList.css";

const ImageList = () => {
  const { notFoundSearchEntry, images } = useContext(MainFeedContext);

  const displayImages = useMemo(() => {
    return images.map((image) => {
      return (
        <div key={image.id} className="ui special cards">
          <div className="card">
            <div className="blurring dimmable image">
              <div className="ui dimmer">
                <div className="content">
                  <div className="center">
                    <div className="ui inverted button">Add Friend</div>
                  </div>
                </div>
              </div>
              <img id="cardImage" key={image.id} src={image.webformatURL} alt="Something else" />
            </div>
            <div className="content">
              <label className="header">{image.user}</label>
              <div className="meta">
                <span className="date"></span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [images]);

  return (
    <div>
      {displayImages.length || !notFoundSearchEntry ? (
        <div className="imageList"> {displayImages} </div>
      ) : (
        <div id="noResultMessage" className="ui icon message">
          <i className="info circle icon"></i>
          <div className="content">
            <div className="ui header tiny">Sorry, we didn't find any matching result for "{notFoundSearchEntry}"</div>
            <p>Try to search something else</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageList;
