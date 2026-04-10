/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                sans: ["IBMPlexSans_400Regular"],
                regular: ["IBMPlexSans_400Regular"],
                medium: ["IBMPlexSans_500Medium"],
                semibold: ["IBMPlexSans_500Medium"],
                bold: ["IBMPlexSans_700Bold"],
                black: ["IBMPlexSans_700Bold"],
            },
            colors: {
                primary: {
                    light: "#00E673",
                    dark: "#00E673",
                },
                secondary: {
                    light: "#1FD0B4",
                    dark: "#1FD0B4",
                },
                tertiary: {
                    light: "#3EBAF4",
                    dark: "#3EBAF4",
                },
            },
        },
    },
    plugins: [],
};
