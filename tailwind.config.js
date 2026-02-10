/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                regular: ["RedHatDisplay_400Regular"],
                medium: ["RedHatDisplay_500Medium"],
                bold: ["RedHatDisplay_700Bold"],
                black: ["RedHatDisplay_900Black"],
            },
            colors: {
                primary: {
                    light: "#00E673",
                    dark: "#00FF7F",
                },
            },
        },
    },
    plugins: [],
};
