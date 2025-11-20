var React = require("react");
var Component = React.Component;
import { useLocation } from "react-router-dom";
import CanvasJSReact from "src/canvasjs.react";
// var CanvasJSReact = require("./canvasjs.react");
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default function ChartJs() {
  const { state } = useLocation();
  console.log(state, "statestate");
  const options = {
    animationEnabled: true,
    // exportEnabled: true,
    theme: "dark1", // "light1", "dark1", "dark2"
    title: {
      text: "90 Day Tracker",
    },
    axisY: {
      //   title: "Bounce Rate",
      suffix: "",
    },
    axisX: {
      //   title: "Week of Year",
      prefix: "",
      interval: 10,
    },
    data: [
      {
        type: "area",
        toolTipContent: " {x}: {y}",
        dataPoints: [{ x: state?.total_earning, y: state?.target_amount }],
      },
    ],
  };
  return (
    <div>
      <CanvasJSChart
        options={options}
        /* onRef={ref => this.chart = ref} */
      />
      {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
    </div>
  );
}
