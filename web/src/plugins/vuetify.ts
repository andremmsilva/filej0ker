/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "customLight",
    themes: {
      customLight: {
        dark: false,
        colors: {
          background: "#F7FAFC", // Light Gray
          surface: "#E2E8F0", // Slightly darker gray for surface elements
          primary: "#5A67D8", // Blue/Purple Blend
          secondary: "#A3BFFA", // Soft Purple
          success: "#38A169", // Calm green for success
          warning: "#D69E2E", // Warm gold for warning
          error: "#E53E3E", // Strong red for error
          info: "#63B3ED", // Soft blue for info
          "on-background": "#1A202C", // Dark Gray/Black for text on background
          "on-surface": "#1A202C", // Dark Gray/Black for text on surface
          "on-primary": "#FFFFFF", // White text on primary
          "on-secondary": "#1A202C", // Dark text on secondary
          "on-success": "#FFFFFF", // White text on success
          "on-warning": "#FFFFFF", // White text on warning
          "on-error": "#FFFFFF", // White text on error
          "on-info": "#FFFFFF", // White text on info
        },
      },
      customDark: {
        dark: true,
        colors: {
          background: "#1A202C",
          surface: "#2D3748",
          primary: "#7F9CF5",
          secondary: "#B794F4",
          success: "#48BB78",
          warning: "#ECC94B",
          error: "#F56565",
          info: "#63B3ED",
          "on-background": "#E2E8F0",
          "on-surface": "#E2E8F0",
          "on-primary": "#FFFFFF",
          "on-secondary": "#1A202C",
          "on-success": "#FFFFFF",
          "on-warning": "#FFFFFF",
          "on-error": "#FFFFFF",
          "on-info": "#FFFFFF",
        },
      },
    },
  },
});
