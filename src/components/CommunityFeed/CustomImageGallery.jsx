import React from "react";

export default function CustomImageGallery({ data, hanldeClick }) {
  const data_length = data.length;

  let image_style = (index) => {
    if (data_length == 1) {
      return {
        width: "100%",
        height: "auto",
      };
    } else if (data_length == 2) {
      return {
        width: "50%",
        height: "auto",
        float: "left",
      };
    } else if (data_length == 3) {
      if (index == 0) {
        return {
          width: "100%",
          height: "auto",
        };
      } else {
        return {
          width: "50%",
          height: "auto",
          float: "left",
        };
      }
    } else if (data_length == 4) {
      return {
        width: "50%",
        height: "200px",

        float: "left",
        objectFit: "cover",
      };
    } else if (data_length == 5) {
      if (index == 0) {
        return {
          width: "100%",
          height: "auto",
        };
      } else {
        return {
          width: "25%",
          height: "110px",
          float: "left",
        };
      }
    } else {
      if (index == 0) {
        return {
          width: "100%",
          height: "auto",
        };
      } else {
        return {
          width: "25%",
          height: "110px",
          float: "left",
        };
      }
    }
  };

  return (
    <div className="w-100">
      {data.slice(0, data_length > 5 ? 4 : 5).map((item, index) => {
        return (
          <img
            src={item}
            srcSet={item}
            loading="lazy"
            className="p-1"
            style={image_style(index)}
            onClick={(e) => {
              hanldeClick(e, index, item);
            }}
          />
        );
      })}
      {data_length > 5 && (
        <div
          className="more-images-count-box"
          style={{
            width: "25%",
            height: "110px",
            float: "left",
          }}
          onClick={(e) => {
            hanldeClick(e, 4, data[4]);
          }}
        >
          <span className="more-images-count">{`${data_length - 4}+`}</span>
          <img
            src={data[4]}
            srcSet={data[4]}
            loading="lazy"
            style={{
              width: "100%",
              height: "110px",
              opacity: "0.2",
            }}
            className="p-1"
          />
        </div>
      )}
    </div>
  );
}
