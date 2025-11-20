import ImageGallery from "react-image-gallery";
import { previous, nextMove } from "src/assets";
const FeedImageSlider = ({ data, autoPlay, selectedIndex }) => {
  const renderLeftNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-custom-left-nav"
        disabled={disabled}
        onClick={onClick}
      >
        <img src={previous} alt="Previous" />
      </button>
    );
  };

  const renderRightNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-custom-right-nav"
        disabled={disabled}
        onClick={onClick}
      >
        <img src={nextMove} alt="Next" />
      </button>
    );
  };
  return (
    <div className="image-slider">
      <ImageGallery
        items={data}
        autoPlay={autoPlay ? autoPlay : false}
        showFullscreenButton={false}
        showPlayButton={false}
        slideInterval={3000}
        startIndex={selectedIndex}
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
      />
    </div>
  );
};

export default FeedImageSlider;
