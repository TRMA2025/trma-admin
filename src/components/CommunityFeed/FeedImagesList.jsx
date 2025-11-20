import * as React from "react";
import { s3baseUrl } from "src/config/config";
import CustomImageGallery from "./CustomImageGallery";
export default function FeedImagesList({ feed_images, handleClickImage }) {
  let new_gallery = [];
  // if (feed_images.length > 0) {
  //   feed_images.map((image) => {
  //     new_gallery.push(s3baseUrl + image?.thumbnail_2);
  //   });
  // }
  // new_gallery.push(s3baseUrl + feed_images);
  if (Array.isArray(feed_images) && feed_images?.length > 0) {
    feed_images &&
      feed_images?.map((image) => {
        new_gallery.push(s3baseUrl + image?.thumbnail_2);
      });
  }

  return (
    <CustomImageGallery data={new_gallery} hanldeClick={handleClickImage} />
  );
}
