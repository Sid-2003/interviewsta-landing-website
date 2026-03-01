import ProfileSidebar from "./ProfileSidebar";
import React, { useState } from "react";

const ProfileManage = () => {
  return (
    <div style={{ display: "flex" }}>
      <ProfileSidebar />
      <div style={{ flex: 1, padding: "24px" }}>
        {/* Your main content */}
        <h2>Welcome!</h2>
      </div>
    </div>
  );
}

export default ProfileManage;
