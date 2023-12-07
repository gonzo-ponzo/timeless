import React from "react";

export default function GoogleMap() {
  return (
    <div>
      <iframe
        src="http://maps.google.com/maps?q=45.25878370498284, 19.81603151844797&z=16&output=embed"
        className="w-full h-full"
      ></iframe>
    </div>
  );
}
