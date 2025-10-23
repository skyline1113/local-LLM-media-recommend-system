import React from "react";

const images = [
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
