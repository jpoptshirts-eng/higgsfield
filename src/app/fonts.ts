import localFont from "next/font/local";

export const calSans = localFont({
  src: "./fonts/CalSans-Regular.ttf",
  variable: "--font-cal-sans",
  display: "swap",
  weight: "400",
});

export const gillSans = localFont({
  src: [
    {
      path: "./fonts/GillSansNova-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/GillSansNova-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/GillSansNova-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/GillSansNova-Ultra.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-gill-sans",
  display: "swap",
});
