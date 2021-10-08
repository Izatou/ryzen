import Chartjs from "chart.js";
import "chartjs-plugin-annotation-more";
import React, {
    forwardRef,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
} from "react";

const chartConfig = {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "S1",
                yAxisID: "A",
                data: [],
                type: "line",
                backgroundColor: "transparent",
                borderColor: "#2EC2C2",
                pointBackgroundColor: "#2EC2C2",
                borderWidth: 2,
            },
            {
                label: "S2",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#FF4747",
                pointBackgroundColor: "#FF4747",
                borderWidth: 2,
            },
            {
                label: "S3",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#3EA919",
                pointBackgroundColor: "#3EA919",
                borderWidth: 2,
            },
            {
                label: "S4",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#FDA700",
                pointBackgroundColor: "#FDA700",
                borderWidth: 2,
            },
            {
                label: "S5",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#CA00FD",
                pointBackgroundColor: "#CA00FD",
                borderWidth: 2,
            },
            {
                label: "S6",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#477BFF",
                pointBackgroundColor: "#477BFF",
                borderWidth: 2,
            },
            {
                label: "S7",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#A2941E",
                pointBackgroundColor: "#A2941E",
                borderWidth: 2,
            },
            {
                label: "S8",
                yAxisID: "A",
                data: [],
                backgroundColor: "transparent",
                borderColor: "#1687AB",
                pointBackgroundColor: "#1687AB",
                borderWidth: 2,
            },
            // {
            //     label: "Temperature",
            //     yAxisID: "B",
            //     data: [],
            //     backgroundColor: "transparent",
            //     borderColor: "#1643ab",
            //     pointBackgroundColor: "#1643ab",
            //     borderWidth: 2,
            // },
            // {
            //     label: "Humidity",
            //     yAxisID: "B",
            //     data: [],
            //     backgroundColor: "transparent",
            //     borderColor: "#ab1683",
            //     pointBackgroundColor: "#ab1683",
            //     borderWidth: 2,
            // },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "bottom",
            labels: {
                fontSize: 16,
                usePointStyle: true,
                boxWidth: 8,
            },
        },
        scales: {
            xAxes: [
                {
                    ticks: { fontSize: 16 },
                    scaleLabel: {
                        display: true,
                        fontSize: 20,
                        labelString: "time (s)",
                    },
                },
            ],
            yAxes: [
                {
                    id: "A",
                    position: "left",
                    ticks: { fontSize: 16 },
                    scaleLabel: {
                        display: true,
                        fontSize: 20,
                        labelString: "Respon Sensor (mV)",
                    },
                },
                // {
                //     id: "B",
                //     position: "right",
                //     ticks: { 
                //         fontSize: 16,
                //         max: 100,
                //         min: 0
                //     },
                //     scaleLabel: {
                //         display: true,
                //         fontSize: 20,
                //         labelString: "Temperature & Humidity",
                //     },
                // },
            ],
        },
        tooltips: {
            enabled: false,
        },
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
        elements: {
            point: {
                radius: 0,
                borderWidth: 0,
                hitRadius: 0,
                hoverRadius: 0,
                hoverBorderWidth: 0,
            },
            line: {
                tension: 0, // disables bezier curves
            },
        },
        plugins: {
            datalabels: {
                display: false,
            },
        },
        annotation: {
            annotations: [
                {
                    type: "box",
                    xScaleID: "x-axis-0",
                    xMin: 0,
                    xMax: 0,
                    backgroundColor: "rgba(255, 0, 0, 0.05)",
                    borderWidth: 1,
                },
            ],
        },
    },
};

export const LineChart = ({ height }, ref) => {
    /**
     * @type {import("react").MutableRefObject<Chartjs>}
     */
    const chartjsRef = useRef();
    const canvasRef = useRef();

    useImperativeHandle(
        ref,
        () => ({
            pushData: (data, elapsedSecond) => {
                chartjsRef.current.data.datasets.forEach((item, index) => {
                    if (index === 8) {
                        index = 9;
                    } else if (index === 9) {
                        index = 10;
                    }
                    item.data.push((data[index] * 5000) / 1023);
                });
                chartjsRef.current.data.labels.push(elapsedSecond);
                chartjsRef.current.update();
            },
            setP2In: milisecond => {
                // chartjsRef.current.options.annotation.annotations[0].xMin =
                //     milisecond / 1000;
                // chartjsRef.current.update();
            },
            setP2Out: milisecond => {
                // chartjsRef.current.options.annotation.annotations[0].xMax =
                //     milisecond / 1000;
                // chartjsRef.current.update();
            },
        }),
        [],
    );

    useLayoutEffect(() => {
        chartjsRef.current = new Chartjs(
            canvasRef.current,
            JSON.parse(JSON.stringify(chartConfig)),
        );

        return () => {
            chartjsRef.current.destroy();
        };
    }, []);

    return (
        <div style={{ height }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default forwardRef(LineChart);
