import { defineConfig } from "allure";

const PROJECTS = {
  KANVAS: "Kanvas",
  MESHERY: "Meshery",
  LAYER5_REMOTE_PROVIDER: "Layer5Cloud",
  MESHERYCTL: "mesheryctl",
  // EXTENSION POINT (see https://docs.meshery.io/extensibility)
  // OPEN AN ISSUE TO ADD TEST RESULTS FROM YOUR EXTENSION HERE.
  // EXTENSION POINT
};

const isProject = (labels, projectName) =>
  labels.find(({ name, value }) => name === "project" && value === projectName);

export default defineConfig({
  name: "Meshery Quality Dashboard",
  output: "./allure-report",
  historyPath: "./history.json",
  plugins: {
    dashboard: {
      options: {
        singleFile: true,
        reportName: "Dashboard",
        reportLanguage: "en",
        logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/meshery/icon-only/meshery-light-icon.svg",
      },
    },
    // awesome: {
    //   options: {
    //     singleFile: false,
    //     reportName: "Dashboard",
    //     reportLanguage: "en",
    //     logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/meshery/icon-only/meshery-light-icon.svg",
    //     reportName: "Aggregate Dashboard",
    //     charts: 
    //       [{
    //         "type": "pie",
    //         "title": "Test Type Distribution",
    //         "data": {
    //           "API Tests": 80,
    //           "UI Tests": 20
    //         },
    //       }
    //     ],
    //     publish: true,
    //   },
    // },
    meshery: {
      import: "@allurereport/plugin-awesome",
      options: {
        reportName: "Meshery",
        singleFile: false,
        reportLanguage: "en",
        open: false,
        logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/meshery/icon-only/meshery-light-icon.svg",
        filter: ({ labels }) => isProject(labels, PROJECTS.MESHERY),
      },
    },
    mesheryctl: {
      import: "@allurereport/plugin-awesome",
      options: {
        reportName: "Mesheryctl",
        singleFile: false,
        reportLanguage: "en",
        open: false,
        logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/meshery/icon-only/meshery-light-icon.svg",
        filter: ({ labels }) => isProject(labels, PROJECTS.MESHERYCTL),
      },
    },
    // EXTENSION POINT (see https://docs.meshery.io/extensibility)
    // OPEN AN ISSUE TO ADD TEST RESULTS FROM YOUR EXTENSION HERE.
    // EXTENSION POINT
    layer5Cloud: {
      import: "@allurereport/plugin-awesome",
      options: {
        reportName: "Extension: Remote Provider Layer5 Cloud",
        singleFile: false,
        reportLanguage: "en",
        open: false,
        logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/layer5/svg/light/5-light-no-trim.svg",
        filter: ({ labels }) =>
          isProject(labels, PROJECTS.LAYER5_REMOTE_PROVIDER),
      },
    },
    kanvas: {
      import: "@allurereport/plugin-awesome",
      options: {
        reportName: "Extension: Kanvas",
        singleFile: false,
        reportLanguage: "en",
        open: false,
        logo: "https://raw.githubusercontent.com/meshery-extensions/qa/refs/heads/master/.github/assets/images/kanvas/kanvas-icon-color-trim.svg",
        filter: ({ labels }) => isProject(labels, PROJECTS.KANVAS),
        // Suite-based hierarchy
        groupBy: ["parentSuite", "suite", "subSuite"],
      },
    },

    log: {
      options: {
        groupBy: "none",
      },
    },
    csv: {
      options: {
        fileName: "report.csv",
      },
    },
  },
});
