// AboutUs.jsx
import React from "react";
import styles from "../Styles/aboutUs.module.css";

const AboutUs = () => {
  return (
    <div className={styles.aboutContainer}>
      <h2>About Us</h2>
      <h3>Problem Statement</h3>
      <p>
        Urban areas often lack reliable and comprehensive information about the
        accessibility of public spaces for individuals with disabilities. This
        creates significant challenges for people with mobility impairments,
        visual impairments, or other disabilities to navigate cities safely and
        efficiently. There is a need for a system that dynamically maps
        accessibility features, identifies obstacles, and provides accurate,
        real-time information to support inclusive urban navigation.
      </p>
      <h3>About Us</h3>
      <p>
        We are a team of college students from Shree L.R. Tiwari Degree College
        committed to creating an accessible urban environment. Our project aims
        to address the challenges faced by individuals with disabilities by
        leveraging community input to create a dynamic, real-time accessibility
        map.
      </p>
      <ul>
        <li>Ankit D. Vishwakarma</li>
        <li>Amisth Mahendrakar</li>
      </ul>
    </div>
  );
};

export default AboutUs;
