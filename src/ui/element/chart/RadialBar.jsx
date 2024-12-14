import Chart from "react-apexcharts";

const RadialBar = ({ total, remain, label }) => {
  const used = total - remain;
  const percentage = Math.floor((used * 100) / total);
  
  return (
    <Chart
      options={{
        plotOptions: {
          radialBar: {
            size: undefined,
            inverseOrder: false,
            startAngle: -45,
            endAngle: 45,
            offsetX: 0,
            offsetY: 0,
            track: {
              show: true,
              startAngle: undefined,
              endAngle: undefined,
              background: "#f2f2f2",
              strokeWidth: "97%",
              opacity: 1,
              margin: 15,
              dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5,
              },
            },
            dataLabels: {
              value: {
                show: true,
                fontSize: "14px",
              },
              total: {
                show: true,
                label,
                color: "#373d3f",
              },
            },
          },
        },
      }}
      series={[percentage]}
      type="radialBar"
      width="100%"
    />
  );
};

export default RadialBar;
