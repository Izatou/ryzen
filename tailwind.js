module.exports = {
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                brand: {
                    green: "#076268",
                    red: "#F80000",
                    "green-light": "#2EC2C2",
                    "green-lighter": "#B5E5E5",
                    keyboard: "#ECECEC",
                },
            },
            spacing: {
                "102": "32rem",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
