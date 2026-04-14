import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const Timeline = ({ roadmaps }) => {
  return (
    <VerticalTimeline>
      {roadmaps.map((item, idx) => (
        <VerticalTimelineElement
        key={idx}
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#4A3AFF", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #4A3AFF" }}
          date="2011 - present"
          iconStyle={{ background: "#4A3AFF", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">{item?.name}</h3>
          <p>
            {item?.head}
          </p>
        </VerticalTimelineElement>
      ))}

      <VerticalTimelineElement
        iconStyle={{ background: "rgb(16, 204, 82)", color: "#fff" }}
      />
    </VerticalTimeline>
  );
};

export default Timeline;
