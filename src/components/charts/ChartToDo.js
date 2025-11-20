import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { get_root_value } from "src/utils/domUtils";
// import { get_root_value } from "src/utils/domUtils";
// import { convertCurrencyToSign } from "src/utils/constants";
// import { _get_user_from_localStorage } from "src/DAL/localStorage/localStorage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [10, 20, 30, 40, 50, 60, 70, 80, 90];
// const amount = [100, 200, 300, 350, 440, 650, 700];

const ChartJs = ({
  ChartDataList,
  days,
  chartDay,
  chartDynamicData,
  TargetToAchieve,
  totalAmount,
}) => {
  console.log(TargetToAchieve, "TargetToAchieve", totalAmount, "totalAmount");
  // const labels = chartDay;
  const labels = days;
  const maxAmount =
    TargetToAchieve < totalAmount
      ? totalAmount + 5000
      : TargetToAchieve > 100000
      ? TargetToAchieve + 10000
      : TargetToAchieve + 5000;
  const maxAmountValue = Number(maxAmount);
  const stepSize = TargetToAchieve > 100000 ? 10000 : "";
  //   const user_profile = _get_user_from_localStorage();
  const options = {
    backgroundColor: get_root_value("--sidebars-background-color"),
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Chart",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          fontColor: get_root_value("--input-text-color"),
          color: get_root_value("--input-text-color"),
          borderColor: get_root_value("--input-text-color"),
        },
        // autoSkip: true,
        maxTicksLimit: 24,
        max: days,
        ticks: {
          color: get_root_value("--input-text-color"),
        },
      },
      y: {
        grid: {
          color: get_root_value("--input-text-color"),
          color: get_root_value("--sidebars-background-color"),
        },

        min: 0,
        max: maxAmountValue === 0 ? 1000 : maxAmountValue,
        ticks: {
          // forces step size to be 50 units
          stepSize: 10,
          color: get_root_value("--input-text-color"),
          maxTicksLimit: 6,
          // minTicksLimit: 5,
          // padding: 20,
          // labelOffset: 20,
          // precision: 0,
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
            if (Math.floor(label) === label) {
              return label;
            }
          },
        },
      },
      // options: {
      //   responsive: true,
      //   maintainAspectRatio: false,
      // },
    },
  };
  // const labels = days;
  const data = {
    labels,
    datasets: [
      {
        // label: `${convertCurrencyToSign(
        //   user_profile.nineteen_day_plan_currency
        // )}`,
        // data: ChartDataList,
        data: chartDynamicData, //this is in the form of x:, y:
        borderColor: get_root_value("--portal-theme-primary"),
        backgroundColor: get_root_value("--portal-theme-primary"),
        pointRadius: 5,
        pointHoverRadius: 5,
      },
    ],
  };
  console.log(data, "datadata");
  return (
    <div id="chartContainer">
      <div className="row">
        <div className="col-md-12 text-center">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};
export default ChartJs;
