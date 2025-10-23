import React from "react";

const images = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
  "/images/4.png",
  "/images/5.png",
  "/images/6.png",
  "/images/7.png",
  "/images/8.png",
  "/images/9.png",
  "/images/10.png",
];

export default function ImageGrid() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        maxWidth: "700px", // 控制一行最多3張
        margin: "0 auto",
        overflowY: "auto",
        maxHeight: "80vh", // 可以向下滑
        padding: "20px",
        border: "1px solid #ccc",
      }}
    >
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`img-${index}`}
          style={{
            width: "300px",
            height: "400px",
            objectFit: "cover",
          }}
        />
      ))}
    </div>
  );
}
