import React from "react";

// Optional: default avatar image path
import defaultAvatar from "../src/assets/img/avater.png"; // make sure you have this image in assets folder

const CommonAvatar = ({ imageUrl, alt = "Employee Photo", size = 80, className = "" }) => {
  const handleImageError = (e) => {
    e.target.src = defaultAvatar; // if image fails to load, use default
  };

  return (
    <img
      src={imageUrl ? imageUrl : defaultAvatar}
      alt={alt}
      onError={handleImageError}
      width={size}
      height={size}
      className={`rounded-full object-cover border border-gray-300 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default CommonAvatar;
